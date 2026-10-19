import { Component } from '@angular/core';
import { TodosComponent } from './todos/todos';

@Component({
  imports: [TodosComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  template: '<app-todos />',
})
export class App {
}
