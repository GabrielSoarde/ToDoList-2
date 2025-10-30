import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CreateToDoItemDto, ToDoItem } from '../../../models/todo-item.model';

// Angular Material Modules
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-add-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
  ],
  styles: [
    `
      .new-task-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
    `,
  ],
  template: `
    <mat-card class="new-task-card">
      <mat-card-header>
        <mat-card-title>Adicionar Nova Tarefa</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form class="new-task-form" [formGroup]="addTaskForm" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="fill">
            <mat-label>Título da tarefa</mat-label>
            <input matInput formControlName="title" placeholder="Ex: Comprar leite">
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Descrição</mat-label>
            <textarea matInput formControlName="description" placeholder="Ex: Lembrar de pegar o desnatado"></textarea>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Data de Vencimento</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="dueDateTime" [min]="minDate">
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Hora de Vencimento (HH:mm)</mat-label>
            <input matInput type="time" formControlName="dueTime">
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Prioridade</mat-label>
            <mat-select formControlName="priority">
              <mat-option value="Alta">Alta</mat-option>
              <mat-option value="Média">Média</mat-option>
              <mat-option value="Baixa">Baixa</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Categoria</mat-label>
            <mat-select formControlName="category">
              @for (cat of categories; track cat) {
                <mat-option [value]="cat">{{ cat }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit" [disabled]="addTaskForm.invalid" (click)="onSubmit()">Adicionar Tarefa</button>
        </form>
      </mat-card-content>
    </mat-card>
  `
})
export class AddTaskFormComponent {
  @Input() categories: string[] = [];
  @Output() taskAdded = new EventEmitter<CreateToDoItemDto>();

  addTaskForm: FormGroup;
  minDate: Date;

  constructor(private fb: FormBuilder) {
    this.minDate = new Date();
    this.addTaskForm = this.fb.group({
      title: ['', Validators.required],
      description: [null],
      dueDateTime: [null],
      dueTime: [null],
      priority: ['Baixa'],
      category: ['Pessoal'],
    });
  }

  onSubmit(): void {
    if (this.addTaskForm.invalid) {
      return;
    }

    const formValue = this.addTaskForm.value;
    let dueDateTime: string | null = null;

    if (formValue.dueDateTime) {
      const date = new Date(formValue.dueDateTime);
      if (formValue.dueTime) {
        const [hours, minutes] = formValue.dueTime.split(':').map(Number);
        date.setHours(hours, minutes);
      }
      dueDateTime = date.toISOString();
    }

    const dto: CreateToDoItemDto = {
      ...formValue,
      dueDateTime: dueDateTime,
      dueDate: undefined, // Remove dueDate as it's replaced by dueDateTime
    };

    this.taskAdded.emit(dto);
    this.addTaskForm.reset({
      title: '',
      description: null,
      dueDateTime: null,
      dueTime: null,
      priority: 'Baixa',
      category: 'Pessoal',
    });
  }
}
