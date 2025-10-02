import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ToDoItem } from '../../../models/todo-item.model';
import { ToDoService } from '../../../services/todo.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class ToDoListComponent implements OnInit {
  
  tasks: ToDoItem[] = [];
  newTaskTitle: string = '';

  editingTask: ToDoItem | null = null; 
  originalTitle: string = '';

  filter: 'all' | 'pending' | 'completed' = 'all';
  completedCount: number = 0;

  constructor(
    private toDoService: ToDoService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  // ================= CRUD =================

  loadTasks(): void {
    this.toDoService.getAll().subscribe({
      next: (data) => {
        this.tasks = data;
        this.updateCompletedCount();
      },
      error: (err) => {
        console.error('Erro ao carregar tarefas. Redirecionando para login.', err);
        this.authService.logout();
        this.router.navigate(['/auth']);
      }
    });
  }

  addTask(): void {
    if (this.newTaskTitle.trim()) {
      this.toDoService.add({ title: this.newTaskTitle.trim() }).subscribe({
        next: (createdTask) => {
          this.tasks.push(createdTask);
          if (createdTask.isComplete) this.completedCount++;
          this.newTaskTitle = '';
        },
        error: (err) => console.error('Erro ao adicionar tarefa:', err)
      });
    }
  }

  updateTask(task: ToDoItem): void {
    const wasComplete = this.tasks.find(t => t.id === task.id)?.isComplete;

    const taskToUpdate: ToDoItem = {
      id: task.id,
      title: task.title,
      isComplete: task.isComplete,
      createdAt: task.createdAt
    };

    this.toDoService.update(taskToUpdate).subscribe({
      next: () => {
        // Ajusta contador se o status mudou
        if (wasComplete !== task.isComplete) {
          this.completedCount += task.isComplete ? 1 : -1;
        }
        this.editingTask = null;
      },
      error: (err) => {
        console.error('Erro ao atualizar tarefa:', err);
        this.loadTasks(); 
      }
    });
  }

  deleteTask(id: number): void {
    if (!confirm("Tem certeza que deseja excluir esta tarefa?")) return;

    const t = this.tasks.find(t => t.id === id);
    this.toDoService.delete(id).subscribe({
      next: () => {
        if (t?.isComplete) this.completedCount--;
        this.tasks = this.tasks.filter(t => t.id !== id);
      },
      error: (err) => console.error('Erro ao excluir tarefa:', err)
    });
  }

  // ================= Edição UI =================

  startEdit(task: ToDoItem): void {
    this.editingTask = { ...task };
    this.originalTitle = task.title;
  }

  cancelEdit(): void {
    if (this.editingTask) {
      const taskIndex = this.tasks.findIndex(t => t.id === this.editingTask!.id);
      if (taskIndex > -1) {
        this.tasks[taskIndex].title = this.originalTitle;
      }
      this.editingTask = null;
    }
  }

  // ================= Autenticação =================

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }

  // ================= Filtros =================

  get filteredTasks() {
    if (this.filter === 'completed') return this.tasks.filter(t => t.isComplete);
    if (this.filter === 'pending') return this.tasks.filter(t => !t.isComplete);
    return this.tasks;
  }

  // ================= Helper =================

  private updateCompletedCount() {
    this.completedCount = this.tasks.filter(t => t.isComplete).length;
  }
}
