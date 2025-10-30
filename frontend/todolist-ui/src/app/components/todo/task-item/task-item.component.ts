import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToDoItem } from '../../../models/todo-item.model';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
  ],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss',
})
export class TaskItemComponent implements OnChanges {
  @Input({ required: true }) task!: ToDoItem;
  @Input() isEditing = false;
  @Input() categories: string[] = [];

  @Output() toggleComplete = new EventEmitter<ToDoItem>();
  @Output() delete = new EventEmitter<ToDoItem>();
  @Output() edit = new EventEmitter<ToDoItem>();
  @Output() save = new EventEmitter<ToDoItem>();
  @Output() cancel = new EventEmitter<void>();

  editTaskForm: FormGroup;
  minDate: Date;

  constructor(private fb: FormBuilder) {
    this.minDate = new Date();
    this.editTaskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      dueDateTime: [null],
      dueTime: [null],
      priority: [''],
      category: [''],
    });
  }

  getDueStatus(): 'overdue' | 'due-today' | 'due-soon' | 'none' {
    if (!this.task.dueDateTime) {
      return 'none';
    }

    const now = new Date();
    const due = new Date(this.task.dueDateTime);

    // Compare full date and time
    if (due.getTime() < now.getTime()) {
      return 'overdue';
    }

    // Check if due today (ignoring time for 'due-today' status, but considering it for 'overdue')
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dueDayStart = new Date(due.getFullYear(), due.getMonth(), due.getDate());

    const diffTime = dueDayStart.getTime() - todayStart.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'due-today';
    }
    if (diffDays <= 7) {
      return 'due-soon';
    }

    return 'none';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task'] && this.task) {
      let initialDueDate: Date | null = null;
      let initialDueTime: string | null = null;

      if (this.task.dueDateTime) {
        const taskDate = new Date(this.task.dueDateTime);
        initialDueDate = taskDate;
        initialDueTime = taskDate.toTimeString().slice(0, 5); // HH:mm
      }

      this.editTaskForm.setValue({
        title: this.task.title,
        description: this.task.description ?? '',
        dueDateTime: initialDueDate,
        dueTime: initialDueTime,
        priority: this.task.priority ?? 'Baixa',
        category: this.task.category ?? 'Pessoal',
      });
    }
  }

  onToggleComplete(event: MatCheckboxChange): void {
    this.toggleComplete.emit({ ...this.task, isComplete: event.checked });
  }

  onSave(): void {
    if (this.editTaskForm.invalid) {
      return;
    }

    const formValue = this.editTaskForm.value;
    let dueDateTime: string | null = null;

    if (formValue.dueDateTime) {
      const date = new Date(formValue.dueDateTime);
      if (formValue.dueTime) {
        const [hours, minutes] = formValue.dueTime.split(':').map(Number);
        date.setHours(hours, minutes);
      }
      dueDateTime = date.toISOString();
    }

    const updatedTask = {
      ...this.task,
      ...formValue,
      dueDateTime: dueDateTime,
      dueDate: undefined, // Ensure dueDate is not sent
    };

    this.save.emit(updatedTask);
  }
}
