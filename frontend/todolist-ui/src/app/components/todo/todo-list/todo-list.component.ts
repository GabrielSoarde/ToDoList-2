import { Component, OnInit, signal, computed, ViewChild, AfterViewInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToDoService } from '../../../services/todo.service';
import { ToDoItem, CreateToDoItemDto } from '../../../models/todo-item.model';
import { AuthService } from '../../../services/auth.service';
import { tap } from 'rxjs';

// Child Components
import { AddTaskFormComponent } from '../add-task-form/add-task-form.component';
import { TaskFilterComponent } from '../task-filter/task-filter.component';
import { TaskListComponent } from '../task-list/task-list.component';

// Angular Material Modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';

import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    AddTaskFormComponent,
    TaskFilterComponent,
    TaskListComponent,
    MatToolbarModule,
    MatButtonModule,
    MatProgressBarModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule, // Adicionado
    MatSnackBarModule, // Adicionado
    NgxSkeletonLoaderModule, // Adicionado
  ],
})
export class ToDoListComponent implements OnInit, AfterViewInit {
  // Referência ao componente de filtro para ler seu estado
  @ViewChild(TaskFilterComponent) private taskFilterComponent!: TaskFilterComponent;

  // State Signals
  tasks = signal<ToDoItem[]>([]);
  editingTaskId = signal<number | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  // Static properties
  categories: string[] = ['Trabalho', 'Pessoal', 'Estudos'];

  // Computed Signals for derived state
  completedCount = computed(() => this.tasks().filter((t) => t.isComplete).length);
  filteredTasks: Signal<ToDoItem[]> = signal([]);

  constructor(
    private router: Router,
    private toDoService: ToDoService,
    private authService: AuthService,
    private dialog: MatDialog, // Adicionado
    private snackBar: MatSnackBar // Adicionado
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  ngAfterViewInit(): void {
    // Agora que o ViewChild está disponível, podemos criar o computed signal
    this.filteredTasks = computed(() => {
      const allTasks = this.tasks();
      // Certifica-se de que o componente filho está disponível
      if (!this.taskFilterComponent) {
        return allTasks;
      }
      const currentFilter = this.taskFilterComponent.filter();
      const currentSearch = this.taskFilterComponent.searchTerm().toLowerCase();
      const currentCategory = this.taskFilterComponent.selectedCategory();

      return allTasks.filter((task) => {
        const statusMatch = currentFilter === 'all' || (currentFilter === 'completed' && task.isComplete) || (currentFilter === 'pending' && !task.isComplete);
        const searchMatch = !currentSearch || task.title.toLowerCase().includes(currentSearch);
        const categoryMatch = currentCategory === 'Todas' || task.category === currentCategory;
        return statusMatch && searchMatch && categoryMatch;
      });
    });
  }

  // --- Data Loading ---
  loadTasks(): void {
    this.loading.set(true);
    this.error.set(null);

    this.toDoService.getAll().subscribe({
      next: (loadedTasks) => {
        this.tasks.set(
          loadedTasks.map((t) => ({
            ...t,
            dueDate: t.dueDate ? t.dueDate.split('T')[0] : undefined,
          }))
        );
        this.loading.set(false);
      },
      error: (err: any) => {
        this.loading.set(false);
        this.error.set(err.message || 'Erro ao carregar tarefas');
      },
    });
  }

  // --- Event Handlers from Child Components ---

  handleTaskAdded(dto: CreateToDoItemDto): void {
    this.toDoService.add(dto).subscribe({
      next: () => {
        this.snackBar.open('Tarefa adicionada com sucesso!', 'Fechar', { duration: 3000 });
        this.loadTasks(); // Recarrega a lista para obter a ordenação correta
      },
      error: (err: any) => {
        this.error.set(err.message || 'Erro ao adicionar tarefa');
      },
    });
  }

  handleCategoryChange(category: string): void {
    this.taskFilterComponent.selectedCategory.set(category);
  }

  handleToggleComplete(task: ToDoItem): void {
    this.toDoService.update(task.id, task).subscribe({
      next: () => {
        this.tasks.update((currentTasks) =>
          currentTasks.map((t) => (t.id === task.id ? { ...t, isComplete: task.isComplete } : t))
        );
      },
      error: (err: any) => {
        this.error.set(err.message || 'Erro ao atualizar status da tarefa');
        this.loadTasks(); // Recarrega para reverter a mudança otimista
      },
    });
  }

  handleDelete(task: ToDoItem): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar Exclusão',
        message: `Tem certeza que deseja excluir a tarefa "${task.title}"?`,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.toDoService.delete(task.id).pipe(
          tap({
            complete: () => {
              this.tasks.update((currentTasks) => currentTasks.filter((t) => t.id !== task.id));
              this.snackBar.open('Tarefa excluída com sucesso!', 'Fechar', { duration: 3000 });
            },
            error: (err: any) => {
              this.error.set(err.message || 'Erro ao deletar tarefa');
            }
          })
        ).subscribe();
      }
    });
  }

  handleSave(task: ToDoItem): void {
    this.toDoService.update(task.id, task).subscribe({
      next: () => {
        this.tasks.update((currentTasks) =>
          currentTasks.map((t) => (t.id === task.id ? task : t))
        );
        this.editingTaskId.set(null);
      },
      error: (err: any) => {
        this.error.set(err.message || 'Falha ao atualizar tarefa');
      },
    });
  }

  handleEdit(task: ToDoItem): void {
    this.editingTaskId.set(task.id);
  }

  handleCancelEdit(): void {
    this.editingTaskId.set(null);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}