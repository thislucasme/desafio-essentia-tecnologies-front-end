import { effect, inject, Injectable, signal } from '@angular/core';
import { CreateTask, Task, TaskStatus, UpdateTask } from '../../features/tasks/models/task';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly authService = inject(AuthService);

  readonly tasks = signal<Task[]>(this.loadTasks());

  constructor() {
    effect(() => {
      this.authService.currentUser();
      this.tasks.set(this.loadTasks());
    });
  }

  create(data: CreateTask): void {
    const now = new Date().toISOString();

    const task: Task = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    this.tasks.update((tasks) => [task, ...tasks]);

    this.saveTasks();
  }

  update(id: string, data: UpdateTask): void {
    this.tasks.update((tasks) =>
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              ...data,
              updatedAt: new Date().toISOString(),
            }
          : task,
      ),
    );

    this.saveTasks();
  }

  delete(id: string): void {
    this.tasks.update((tasks) => tasks.filter((task) => task.id !== id));

    this.saveTasks();
  }

  changeStatus(id: string, status: TaskStatus): void {
    this.update(id, { status });
  }

  private saveTasks(): void {
    const storageKey = this.getStorageKey();

    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(this.tasks()));
    }
  }

  private loadTasks(): Task[] {
    const storageKey = this.getStorageKey();

    if (!storageKey) {
      return [];
    }

    const tasks = localStorage.getItem(storageKey);

    if (!tasks) {
      return [];
    }

    try {
      return JSON.parse(tasks) as Task[];
    } catch {
      return [];
    }
  }

  private getStorageKey(): string | null {
    const user = this.authService.currentUser();
    return user ? `tasks-${user.id}` : null;
  }
}
