// src/app/services/todo.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Todo } from '../models/todo.model';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private http  = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/todo`;

  // 📦 Get all todos
  getAll(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // 🔍 Get a single todo by ID
  getById(id: number): Observable<Todo> {
    return this.http.get<Todo>(`\({this.apiUrl}/\){id}`).pipe(
      catchError(this.handleError)
    );
  }

  // ➕ Create a new todo
  create(todo: Omit<Todo, 'id'>): Observable<Todo> {
    return this.http.post<Todo>(this.apiUrl, todo).pipe(
      catchError(this.handleError)
    );
  }

  // 🗑️ Delete a todo
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // 🚨 Centralised error handler
  private handleError(error: HttpErrorResponse): Observable<never> {
    let message = 'An unexpected error occurred';
    if (error.status === 0) {
      message = 'Cannot reach the server. Is the .NET API running?';
    } else if (error.status === 404) {
      message = 'Resource not found';
    } else if (error.error?.message) {
      message = error.error.message;
    }
    console.error('API Error:', error);
    return throwError(() => new Error(message));
  }
}
