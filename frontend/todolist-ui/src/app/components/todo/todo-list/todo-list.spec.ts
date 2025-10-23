import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToDoListComponent } from './todo-list.component';

describe('ToDoListComponent', () => {
  let component: ToDoListComponent;
  let fixture: ComponentFixture<ToDoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToDoListComponent, HttpClientTestingModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ToDoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});