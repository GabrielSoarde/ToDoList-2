import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
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
    DatePipe,
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

  constructor(private fb: FormBuilder) {
    this.editTaskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      dueDate: [''],
      priority: [''],
      category: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task']) {
      this.editTaskForm.setValue({
        title: this.task.title,
        description: this.task.description ?? '',
        dueDate: this.task.dueDate ?? '',
        priority: this.task.priority ?? 'Baixa',
        category: this.task.category ?? 'Pessoal'
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
    const updatedTask = {
      ...this.task,
      ...formValue,
      dueDate: formValue.dueDate ? new Date(formValue.dueDate).toISOString().split('T')[0] : null
    };

    this.save.emit(updatedTask);
  }
}
