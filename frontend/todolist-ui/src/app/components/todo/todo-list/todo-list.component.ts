// src/app/components/todo/todo-list/todo-list.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para usar *ngIf, *ngFor, etc.
import { FormsModule } from '@angular/forms'; // Para os formulários
import { Router } from '@angular/router'; // Para navegação e logout

import { ToDoItem } from '../../../models/todo-item.model';
import { ToDoService } from '../../../services/todo.service'; // O NOVO SERVIÇO
import { AuthService } from '../../../services/auth.service'; // Para logout

@Component({
  selector: 'app-todo-list',
  standalone: true,
  // Adicionamos os módulos necessários para o template:
  imports: [CommonModule, FormsModule], 
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css'
})
export class ToDoListComponent implements OnInit {
  
  // Array que armazena as tarefas do usuário
  tasks: ToDoItem[] = [];
  
  // Modelo para o formulário de nova tarefa
  newTaskTitle: string = '';
  
  // Modelo para a edição
  editingTask: ToDoItem | null = null; 
  originalTitle: string = '';
  
  constructor(
    private toDoService: ToDoService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Ao iniciar o componente, carregamos as tarefas
    this.loadTasks();
  }

  // ============== Lógica de Carregamento e CRUD ==============

  loadTasks(): void {
    this.toDoService.getAll().subscribe({
      next: (data) => {
        this.tasks = data;
      },
      error: (err) => {
        // Se a requisição falhar (ex: token expirado), forçamos o logout
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
          this.newTaskTitle = ''; // Limpa o campo
        },
        error: (err) => console.error('Erro ao adicionar tarefa:', err)
      });
    }
  }

  // Usado para marcar/desmarcar o checkbox ou salvar a edição
  updateTask(task: ToDoItem): void {
    // Cria uma cópia limpa para enviar à API (sem campos de controle de UI)
    const taskToUpdate: ToDoItem = {
      id: task.id,
      title: task.title,
      isComplete: task.isComplete,
      createdAt: task.createdAt // O backend usa essa info, mas geralmente não é estritamente necessária aqui
    };

    this.toDoService.update(taskToUpdate).subscribe({
      next: () => {
        // Se a edição estava ativa, desativa
        this.editingTask = null;
      },
      error: (err) => {
        console.error('Erro ao atualizar tarefa:', err);
        // Se a atualização falhar, recarregamos para reverter o estado local
        this.loadTasks(); 
      }
    });
  }

  deleteTask(id: number): void {
    this.toDoService.delete(id).subscribe({
      next: () => {
        // Remove do array localmente sem precisar recarregar
        this.tasks = this.tasks.filter(t => t.id !== id);
      },
      error: (err) => console.error('Erro ao excluir tarefa:', err)
    });
  }
  
  // ============== Lógica de Edição de UI ==============

  startEdit(task: ToDoItem): void {
    this.editingTask = { ...task }; // Cria uma cópia para edição
    this.originalTitle = task.title; // Salva o título original
  }

  cancelEdit(): void {
    // Reverte o título da tarefa sendo editada se o usuário cancelar
    if (this.editingTask) {
      const taskIndex = this.tasks.findIndex(t => t.id === this.editingTask!.id);
      if (taskIndex > -1) {
        this.tasks[taskIndex].title = this.originalTitle;
      }
      this.editingTask = null;
    }
  }

  // ============== Lógica de Autenticação ==============

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}