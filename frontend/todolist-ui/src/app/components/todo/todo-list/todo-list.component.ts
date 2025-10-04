import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToDoService } from '../../../services/todo.service';
import { ToDoItem } from '../../../models/todo-item.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, DatePipe]
})
export class ToDoListComponent implements OnInit {
  // State as Signals
  tasks = signal<ToDoItem[]>([]);
  editingTask = signal<ToDoItem | null>(null);
  filter = signal<'all' | 'pending' | 'completed'>('all');
  searchTerm = signal<string>('');
  selectedCategory = signal<string>('Todas');
  
  // Forms
  addTaskForm: FormGroup;
  editTaskForm: FormGroup;

  // Static properties
  categories: string[] = ['Trabalho', 'Pessoal', 'Estudos'];

  // Computed Signals for derived state
  completedCount = computed(() => this.tasks().filter(t => t.isComplete).length);
  filteredTasks = computed(() => {
    const allTasks = this.tasks();
    const currentFilter = this.filter();
    const currentSearch = this.searchTerm().toLowerCase();
    const currentCategory = this.selectedCategory();

    return allTasks.filter(task => {
      if (currentFilter === 'completed' && !task.isComplete) return false;
      if (currentFilter === 'pending' && task.isComplete) return false;
      if (currentSearch && !task.title.toLowerCase().includes(currentSearch)) return false;
      if (currentCategory !== 'Todas' && task.category !== currentCategory) return false;
      return true;
    });
  });

  constructor(
    private router: Router, 
    private toDoService: ToDoService, 
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.addTaskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      dueDate: [''],
      priority: ['Baixa'],
      category: ['Pessoal']
    });

    this.editTaskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      dueDate: [''],
      priority: [''],
      category: ['']
    });
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.toDoService.getAll().subscribe({
      next: (loadedTasks) => this.tasks.set(loadedTasks.map(t => ({
        ...t,
        dueDate: t.dueDate ? t.dueDate.split('T')[0] : undefined
      }))),
      error: (err) => console.error('Erro ao carregar tarefas:', err)
    });
  }

  addTask(): void {
    if (this.addTaskForm.invalid) {
      alert('O título da tarefa é obrigatório.');
      return;
    }

    const payload = this.addTaskForm.value;
    this.toDoService.add(payload).subscribe({
      next: (newTask) => {
        this.tasks.update(currentTasks => [...currentTasks, newTask]);
        this.addTaskForm.reset({ priority: 'Baixa', category: 'Pessoal' });
      },
      error: (err) => console.error('Erro ao adicionar tarefa:', err)
    });
  }

  startEdit(task: ToDoItem): void {
    this.editingTask.set(task);
    this.editTaskForm.setValue({
      title: task.title,
      description: task.description ?? '',
      dueDate: task.dueDate ?? '',
      priority: task.priority ?? 'Baixa',
      category: task.category ?? 'Pessoal'
    });
  }

  updateTaskOnCompletion(task: ToDoItem, isComplete: boolean) {
    const payload = { ...task, isComplete };
    this.toDoService.update(task.id, payload).subscribe({
      next: () => {
        this.tasks.update(currentTasks =>
          currentTasks.map(t => t.id === task.id ? { ...t, isComplete } : t)
        );
      },
      error: (err) => console.error('Erro ao atualizar status da tarefa:', err)
    });
  }

  submitEdit(): void {
    if (this.editTaskForm.invalid || !this.editingTask()) {
      return;
    }
    const originalTask = this.editingTask()!;
    const updatedValues = this.editTaskForm.value;

    const payload = {
      ...originalTask,
      ...updatedValues
    };

    this.toDoService.update(originalTask.id, payload).subscribe({
      next: () => {
        this.tasks.update(currentTasks => 
          currentTasks.map(t => t.id === originalTask.id ? payload : t)
        );
        this.editingTask.set(null);
      },
      error: (err) => {
        console.error('Erro ao atualizar tarefa:', err);
        alert('Falha ao atualizar tarefa. Verifique os dados.');
      }
    });
  }

  cancelEdit(): void {
    this.editingTask.set(null);
    this.editTaskForm.reset();
  }

  deleteTask(id: number): void {
    this.toDoService.delete(id).subscribe({
      next: () => {
        this.tasks.update(currentTasks => currentTasks.filter(t => t.id !== id));
      },
      error: (err) => console.error('Erro ao deletar tarefa:', err)
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}
