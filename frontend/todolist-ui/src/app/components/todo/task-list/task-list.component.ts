import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToDoItem } from '../../../models/todo-item.model';
import { TaskItemComponent } from '../task-item/task-item.component';

// Angular Material Modules
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskItemComponent, MatListModule],
  styles: [
    `
      .empty-state {
        text-align: center;
        padding: 48px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }

      .empty-state h3 {
        margin: 0;
        font-size: 1.5em;
      }

      .empty-state p {
        color: #666;
      }

      /* Remove default padding from mat-list-item so the card takes up the full width */
      ::ng-deep .mat-mdc-list-item .mdc-list-item__content {
        padding: 0 !important;
      }

      mat-list-item {
        height: auto !important;
        margin-bottom: 16px;
      }
    `,
  ],
  template: `
    <div class="task-list-container">
      @if (tasks.length > 0) {
        <mat-list role="list">
          @for (task of tasks; track task.id) {
            <mat-list-item role="listitem">
              <app-task-item
                [task]="task"
                [isEditing]="editingTaskId === task.id"
                [categories]="categories"
                (toggleComplete)="toggleComplete.emit($event)"
                (delete)="delete.emit($event)"
                (edit)="edit.emit($event)"
                (save)="save.emit($event)"
                (cancel)="cancel.emit()"
              />
            </mat-list-item>
          }
        </mat-list>
      } @else {
        <div class="empty-state">
          <h3>Nenhuma tarefa encontrada.</h3>
          <p>Que tal adicionar uma nova tarefa para começar?</p>
        </div>
      }
    </div>
  `
})
export class TaskListComponent {
  @Input() tasks: ToDoItem[] = [];
  @Input() editingTaskId: number | null = null;
  @Input() categories: string[] = [];

  @Output() toggleComplete = new EventEmitter<ToDoItem>();
  @Output() delete = new EventEmitter<ToDoItem>();
  @Output() edit = new EventEmitter<ToDoItem>();
  @Output() save = new EventEmitter<ToDoItem>();
  @Output() cancel = new EventEmitter<void>();
}
