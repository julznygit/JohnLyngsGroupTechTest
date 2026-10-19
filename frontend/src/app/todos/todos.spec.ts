import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TodoService } from '../services/todo.service';
import { TodosComponent } from './todos';

describe('TodosComponent', () => {
  let component: TodosComponent;
  let fixture: ComponentFixture<TodosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodosComponent],
      providers: [
        {
          provide: TodoService,
          useValue: {
            getAll: () => of([{ id: 1, title: 'Test todo', isCompleted: false }]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TodosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render todos returned by the service', () => {
    const rows = fixture.nativeElement.querySelectorAll('.todo-row');

    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('Test todo');
  });
});
