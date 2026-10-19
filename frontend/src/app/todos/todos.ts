import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../services/todo.service';
import { Todo } from '../models/todo.model';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './todos.html',
  styleUrl: './todos.css',
})
export class TodosComponent implements OnInit {
  private todoService = inject(TodoService);

  // State signals
  todos = signal<Todo[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  showCreateForm = signal(false);
  createError = signal<string | null>(null);
  creating = signal(false);
  newTodo: Omit<Todo, 'id'> = { title: '', isCompleted: false };

  ngOnInit() {
    this.loadTodos();
  }
  
  openCreateForm() {
    this.createError.set(null);
    this.showCreateForm.set(true);
  }

  closeCreateForm() {
    this.showCreateForm.set(false);
    this.createError.set(null);
    this.newTodo = { title: '', isCompleted: false };
  }

  loadTodos() {
    this.loading.set(true);
    this.error.set(null);

    this.todoService.getAll().subscribe({
      next: (data) => {
        this.todos.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  deleteTodo(id: number) {
    this.todoService.delete(id).subscribe({
      next: () => this.todos.update((items) => items.filter((todo) => todo.id !== id)),
    });
  }

  createTodo() {
    if (this.creating()) return;

    this.creating.set(true);
    this.createError.set(null);
    this.todoService.create(this.newTodo).subscribe({
      next: (createdTodo) => {
        this.todos.update((items) => [...items, createdTodo]);
        this.creating.set(false);
        this.closeCreateForm();
      },
      error: (err) => {
        this.createError.set(err.message);
        this.creating.set(false);
      },
    });
  }
}
