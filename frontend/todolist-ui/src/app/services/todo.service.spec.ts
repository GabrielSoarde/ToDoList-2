import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ToDoService } from './todo.service';
import { ToDoItem, CreateToDoItemDto } from '../models/todo-item.model';
import { environment } from '../../environments/environment';

describe('ToDoService', () => {
  let service: ToDoService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/ToDoItems`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ToDoService]
    });
    service = TestBed.inject(ToDoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Garante que não há requisições pendentes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all tasks for a user via GET', () => {
    const mockTasks: ToDoItem[] = [
      { id: 1, title: 'Test Task 1', isComplete: false, createdAt: new Date().toISOString() },
      { id: 2, title: 'Test Task 2', isComplete: true, createdAt: new Date().toISOString() }
    ];

    service.getAll().subscribe(tasks => {
      expect(tasks.length).toBe(2);
      expect(tasks).toEqual(mockTasks);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks);
  });

  it('should add a new task via POST', () => {
    const newTaskDto: CreateToDoItemDto = { title: 'New Task' };
    const createdTask: ToDoItem = { id: 3, title: 'New Task', isComplete: false, createdAt: new Date().toISOString() };

    service.add(newTaskDto).subscribe(task => {
      expect(task).toEqual(createdTask);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTaskDto);
    req.flush(createdTask);
  });

  it('should update a task via PUT', () => {
    const taskId = 1;
    const updatedTask: Partial<ToDoItem> = { title: 'Updated Title', isComplete: true };

    service.update(taskId, updatedTask).subscribe(() => {});

    const req = httpMock.expectOne(`${apiUrl}/${taskId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedTask);
    req.flush(null, { status: 204, statusText: 'No Content' });
  });

  it('should delete a task via DELETE', () => {
    const taskId = 1;

    service.delete(taskId).subscribe(() => {});

    const req = httpMock.expectOne(`${apiUrl}/${taskId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null, { status: 204, statusText: 'No Content' });
  });

});
