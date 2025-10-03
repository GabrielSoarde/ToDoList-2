import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Task {
  id: number;
  title: string;
  description?: string;
  isComplete: boolean;
  dueDate?: Date;
  priority?: 'Alta' | 'Média' | 'Baixa';
  category?: string;
}

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,   // habilita *ngIf, *ngFor
    FormsModule,    // habilita [(ngModel)]
    DatePipe        // habilita o | date
  ]
})
export class ToDoListComponent {
  tasks: Task[] = [];
  editingTask: Task | null = null;

  // Filtros e busca
  filter: 'all' | 'pending' | 'completed' = 'all';
  searchTerm: string = '';
  selectedCategory: string = 'Todas';

  // Categorias
  categories: string[] = ['Trabalho', 'Pessoal', 'Estudos'];

  // Contador de concluídas
  get completedCount(): number {
    return this.tasks.filter(t => t.isComplete).length;
  }

  // Lista filtrada
  get filteredTasks(): Task[] {
    return this.tasks.filter(task => {
      if (this.filter === 'completed' && !task.isComplete) return false;
      if (this.filter === 'pending' && task.isComplete) return false;
      if (this.searchTerm && !task.title.toLowerCase().includes(this.searchTerm.toLowerCase())) return false;
      if (this.selectedCategory !== 'Todas' && task.category !== this.selectedCategory) return false;
      return true;
    });
  }

  // Adicionar tarefa
  addTask(
    title: string,
    description?: string,
    dueDate?: string | null,
    priority?: string,
    category?: string
  ): void {
    if (!title.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      title,
      description,
      isComplete: false,
      dueDate: dueDate ? new Date(dueDate) : undefined, // converte string -> Date
      priority: priority as 'Alta' | 'Média' | 'Baixa',
      category: category || 'Pessoal'
    };

    this.tasks.push(newTask);
  }

  // Editar tarefa
  startEdit(task: Task): void {
    this.editingTask = { ...task };
  }

  updateTask(task: Task): void {
    const index = this.tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      this.tasks[index] = { ...task };
    }
    this.editingTask = null;
  }

  cancelEdit(): void {
    this.editingTask = null;
  }

  // Deletar
  deleteTask(id: number): void {
    this.tasks = this.tasks.filter(t => t.id !== id);
  }

  // Logout (placeholder)
  logout(): void {
    console.log('Usuário saiu.');
  }
}
