import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ToDoItem } from '../models/todo-item.model';

@Injectable({
  providedIn: 'root'
})
export class ToDoService {
  private apiUrl = `${environment.apiUrl}/ToDoItems`;

  constructor(private http: HttpClient) { }

  /**
   * GET: /api/ToDoItems
   * Retorna todas as tarefas do usuário autenticado.
   */
  getAll(): Observable<ToDoItem[]> {
    // A API retorna um array de ToDoItem
    return this.http.get<ToDoItem[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * POST: /api/ToDoItems
   * Adiciona uma nova tarefa.
   */
  add(item: { 
  title: string;
  description?: string;
  dueDate?: string | null;     
  priority?: string | null;
  category?: string | null;
  isComplete?: boolean;
}): Observable<ToDoItem> {
  return this.http.post<ToDoItem>(this.apiUrl, item).pipe(
    catchError(this.handleError)
  );
}

update(
  id: number,
  item: { 
    title?: string; 
    dueDate?: string | null;   
    priority?: string; 
    category?: string;
    isComplete?: boolean;
  }
): Observable<void> {
  return this.http.put<void>(`${this.apiUrl}/${id}`, item).pipe(
    catchError(this.handleError)
  );
}

  /**
   * DELETE: /api/ToDoItems/{id}
   * Remove uma tarefa.
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro desconhecido';
    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro do lado do servidor
      switch (error.status) {
        case 400:
          errorMessage = 'Dados inválidos. Verifique as informações e tente novamente.';
          break;
        case 401:
          errorMessage = 'Sessão expirada. Por favor, faça login novamente.';
          break;
        case 403:
          errorMessage = 'Acesso negado. Você não tem permissão para esta operação.';
          break;
        case 404:
          errorMessage = 'Recurso não encontrado.';
          break;
        case 500:
          errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
          break;
        default:
          errorMessage = `Código do erro: ${error.status}, Mensagem: ${error.message}`;
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}