import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-task-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatIconModule,
  ],
  styles: [`
    .filters-container {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap; /* Allow wrapping on smaller screens */
      width: 100%;
    }

    .search-field, .category-select {
      flex: 1 1 200px; /* Allow fields to grow and shrink */
    }

    .filter-toggles {
      flex-shrink: 0; /* Prevent toggle group from shrinking */
    }
  `],
  template: `
    <div class="filters-container">
      <mat-form-field appearance="outline" class="search-field">
        <mat-label>Buscar tarefa</mat-label>
        <mat-icon matPrefix>search</mat-icon>
        <input matInput type="text" placeholder="Ex: Reunião com cliente" [ngModel]="searchTerm()" (ngModelChange)="searchTerm.set($event)">
      </mat-form-field>

      <mat-form-field appearance="outline" class="category-select">
        <mat-label>Categoria</mat-label>
        <mat-select [ngModel]="selectedCategory()" (ngModelChange)="selectedCategory.set($event)">
          <mat-option value="Todas">Todas as Categorias</mat-option>
          @for (cat of categories; track cat) {
            <mat-option [value]="cat">{{ cat }}</mat-option>
          }
        </mat-select>
      </mat-form-field>

      <mat-button-toggle-group class="filter-toggles" [ngModel]="filter()" (ngModelChange)="filter.set($event)" aria-label="Filtrar tarefas">
        <mat-button-toggle value="all">Todas</mat-button-toggle>
        <mat-button-toggle value="pending">Pendentes</mat-button-toggle>
        <mat-button-toggle value="completed">Concluídas</mat-button-toggle>
      </mat-button-toggle-group>
    </div>
  `
})
export class TaskFilterComponent {
  @Input() categories: string[] = [];

  // State is managed within this component
  filter = signal<'all' | 'pending' | 'completed'>('all');
  searchTerm = signal<string>('');
  selectedCategory = signal<string>('Todas');
}
