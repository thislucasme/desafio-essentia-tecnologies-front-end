import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TaskList } from './task-list';

describe('TaskList', () => {
  beforeEach(async () => {
    localStorage.setItem(
      'todo-session',
      JSON.stringify({ id: 'test-user', name: 'Lucas', email: 'lucas@example.com' }),
    );

    await TestBed.configureTestingModule({
      imports: [TaskList],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  afterEach(() => localStorage.clear());

  it('should render the authenticated task page', async () => {
    const fixture = TestBed.createComponent(TaskList);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('app-header')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Minhas tarefas');
  });
});
