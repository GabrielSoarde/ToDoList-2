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
  minDate: Date; // Para o datepicker de edição

  constructor(private fb: FormBuilder) {
    this.minDate = new Date(); // Impede datas passadas na edição
    this.editTaskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      dueDate: [''],
      priority: [''],
      category: ['']
    });
  }

  // Verifica o status de vencimento da tarefa
  getDueStatus(): 'due-today' | 'due-soon' | 'none' {
    if (!this.task.dueDate) {
      return 'none';
    }

    const today = new Date();
    const dueDate = new Date(this.task.dueDate);
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'due-today'; // Atrasado conta como "vence hoje" para fins de estilo
    }
    if (diffDays === 0) {
      return 'due-today';
    }
    if (diffDays <= 7) {
      return 'due-soon';
    }

    return 'none';
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
