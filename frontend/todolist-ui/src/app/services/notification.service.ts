import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToDoItem } from '../models/todo-item.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  constructor() { }

  checkAndNotify(tasks: ToDoItem[]): void {
    const now = new Date();

    tasks.forEach(task => {
      if (task.dueDateTime && !task.isComplete) {
        const due = new Date(task.dueDateTime);
        const diffMs = due.getTime() - now.getTime();
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 7) {
          this.showNotification(`Lembrete: A tarefa '${task.title}' vence em 7 dias.`, 'info');
        } else if (diffDays === 4) {
          this.showNotification(`Aviso: A tarefa '${task.title}' vence em 4 dias.`, 'info');
        } else if (diffDays === 1) {
          this.showNotification(`Urgente: A tarefa '${task.title}' vence amanhã!`, 'primary');
        } else if (diffDays === 0 && diffMs > 0) {
          // Vence hoje, mas ainda não passou do horário
          this.showNotification(`Vence hoje: A tarefa '${task.title}' vence hoje às ${due.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}.`, 'accent');
        } else if (diffMs <= 0 && diffDays < 0) {
          // Já venceu
          this.showNotification(`Atrasado: A tarefa '${task.title}' venceu em ${due.toLocaleDateString('pt-BR')} às ${due.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}.`, 'warn');
        }
      }
    });
  }

  private showNotification(message: string, panelClass: string = 'info'): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 10000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }
}
