import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToDoService } from '../../../services/todo.service';

// Interface compatível com backend
interface Task {
  id: number;
  title: string;
  description?: string;
  isComplete: boolean;
  createdAt: string;
  dueDate?: string;
  priority?: 'Alta' | 'Média' | 'Baixa';
  category?: string;
}

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe]
})
export class ToDoListComponent implements OnInit {
  tasks: Task[] = [];
  editingTask: Task | null = null; // Tarefa em edição (cópia)

  filter: 'all' | 'pending' | 'completed' = 'all';
  searchTerm: string = '';
  selectedCategory: string = 'Todas';
  categories: string[] = ['Trabalho', 'Pessoal', 'Estudos'];

  constructor(private router: Router, private toDoService: ToDoService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  // Carrega tarefas do backend
  loadTasks(): void {
    this.toDoService.getAll().subscribe({
      next: (tasks) => this.tasks = tasks.map(t => ({
      ...t,
      createdAt: t.createdAt,
      dueDate: t.dueDate ?? undefined
    })),
      error: (err) => console.error('Erro ao carregar tarefas:', err)
    });
  }

  get completedCount(): number {
    return this.tasks.filter(t => t.isComplete).length;
  }

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
  dueDate?: string,
  priority?: string,
  category?: string
): void {
  if (!title.trim()) return;

  const validPriorities = ['Alta', 'Média', 'Baixa'];
  let taskPriority: 'Alta' | 'Média' | 'Baixa' | undefined = undefined;

  if (priority && validPriorities.includes(priority)) {
    taskPriority = priority as 'Alta' | 'Média' | 'Baixa';
  }

  const payload = {
    title,
    description,
    dueDate: dueDate ?? null,   // já é string (ex: "2025-10-03")
    priority: taskPriority,
    category,
    isComplete: false
  };

  this.toDoService.add(payload).subscribe({
    next: (task) => {
      const newTask: Task = {
        id: task.id,
        title: task.title,
        description: task.description ?? '',
        dueDate: task.dueDate ?? undefined,   // sem converter
        priority: task.priority ?? undefined,
        category: task.category ?? undefined,
        isComplete: task.isComplete,
        createdAt: task.createdAt             // sem converter
      };
      this.tasks.push(newTask);
    },
    error: (err) => console.error('Erro ao adicionar tarefa:', err)
  });
}

  /**
   * Inicia a edição, criando uma cópia da tarefa para não alterar a lista original
   */
  startEdit(task: Task): void {
    this.editingTask = { ...task };
  }

  /**
   * Salva as alterações da tarefa editada (que é o this.editingTask)
   */
  updateTask(task: Task) {
    if (!task.title.trim()) {
      alert('Título não pode ficar vazio');
      return;
    }

    const payload: any = {
      title: task.title,
      dueDate: task.dueDate ?? null,
      priority: task.priority ?? undefined,
      category: task.category ?? undefined,
      isComplete: task.isComplete
    };

    this.toDoService.update(task.id, payload).subscribe({
      next: () => {
        const index = this.tasks.findIndex(t => t.id === task.id);
        if (index !== -1) this.tasks[index] = { ...task };
        this.editingTask = null;
      },
      error: (err) => {
        console.error('Erro ao atualizar tarefa:', err);
        alert('Falha ao atualizar tarefa. Verifique os dados.');
      }
    });
  }

  /**
   * Cancela a edição, descartando as mudanças
   */
  cancelEdit(): void {
    this.editingTask = null;
  }

  deleteTask(id: number): void {
    this.toDoService.delete(id).subscribe({
      next: () => this.tasks = this.tasks.filter(t => t.id !== id),
      error: (err) => console.error('Erro ao deletar tarefa:', err)
    });
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_email');
    this.router.navigate(['/auth']);
  }
}