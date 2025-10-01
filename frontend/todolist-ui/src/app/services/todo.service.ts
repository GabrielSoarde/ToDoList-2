import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ToDoItem } from '../models/todo-item.model';

@Injectable({
  providedIn: 'root'
})
export class ToDoService {
  // A URL da API para o ToDoItemsController (http://localhost:5269/api/ToDoItems)
  private apiUrl = 'http://localhost:5269/api/ToDoItems';

  constructor(private http: HttpClient) { }

  /**
   * GET: /api/ToDoItems
   * Retorna todas as tarefas do usuário autenticado.
   */
  getAll(): Observable<ToDoItem[]> {
    // A API retorna um array de ToDoItem
    return this.http.get<ToDoItem[]>(this.apiUrl);
  }

  /**
   * POST: /api/ToDoItems
   * Adiciona uma nova tarefa.
   */
  add(item: { title: string }): Observable<ToDoItem> {
    // Nota: A API adiciona o UserId, CreatedAt e o ID.
    // Enviamos apenas o Título (e IsComplete, se necessário, mas geralmente é falso por padrão).
    const newItem: Partial<ToDoItem> = {
      title: item.title,
      isComplete: false
    };
    return this.http.post<ToDoItem>(this.apiUrl, newItem);
  }

  /**
   * PUT: /api/ToDoItems/{id}
   * Atualiza uma tarefa existente (usado para alternar o status ou editar o título).
   */
  update(item: ToDoItem): Observable<void> {
    // O backend espera o item completo para verificar a propriedade
    return this.http.put<void>(`${this.apiUrl}/${item.id}`, item);
  }

  /**
   * DELETE: /api/ToDoItems/{id}
   * Remove uma tarefa.
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}