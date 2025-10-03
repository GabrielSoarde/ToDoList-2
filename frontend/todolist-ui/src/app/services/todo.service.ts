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
  add(item: { 
  title: string;
  description?: string;
  dueDate?: string | null;     // <-- string, não Date
  priority?: string | null;
  category?: string | null;
  isComplete?: boolean;
}): Observable<ToDoItem> {
  return this.http.post<ToDoItem>(this.apiUrl, item);
}

update(
  id: number,
  item: { 
    title: string; 
    dueDate?: string | null;   // <-- string, não Date
    priority?: string; 
    category?: string;
    isComplete?: boolean;
  }
): Observable<void> {
  return this.http.put<void>(`${this.apiUrl}/${id}`, item);
}

  /**
   * DELETE: /api/ToDoItems/{id}
   * Remove uma tarefa.
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}