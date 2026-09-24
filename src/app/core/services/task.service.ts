import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CreateTask, Task, TaskStatus, UpdateTask } from '../../features/tasks/models/task';
import { API_URL } from '../config/api';

interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

interface PaginatedTasksResponse {
  data: Task[];
  meta: PaginationMeta;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpClient);

  readonly tasks = signal<Task[]>([]);
  readonly totalItems = signal(0);
  readonly totalPages = signal(1);
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');

  async findAll(page = 1, limit = 2): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const params = new HttpParams().set('page', page).set('limit', limit);
      const response = await firstValueFrom(
        this.http.get<PaginatedTasksResponse>(`${API_URL}/tarefas`, { params }),
      );
      this.tasks.set(response.data);
      this.totalItems.set(response.meta.totalItems);
      this.totalPages.set(response.meta.totalPages);
    } catch (error) {
      this.tasks.set([]);
      this.errorMessage.set(this.getErrorMessage(error));
    } finally {
      this.isLoading.set(false);
    }
  }

  create(data: CreateTask): Promise<Task> {
    return firstValueFrom(this.http.post<Task>(`${API_URL}/tarefas`, data));
  }

  async update(id: string, data: UpdateTask): Promise<Task> {
    const task = await firstValueFrom(this.http.patch<Task>(`${API_URL}/tarefas/${id}`, data));
    this.tasks.update((tasks) => tasks.map((item) => (item.id === id ? task : item)));
    return task;
  }

  delete(id: string): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${API_URL}/tarefas/${id}`));
  }

  changeStatus(id: string, status: TaskStatus): Promise<Task> {
    return this.update(id, { status });
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) return 'Não foi possível conectar ao servidor.';

      const message = error.error?.message;
      if (Array.isArray(message)) return message.join(' ');
      if (typeof message === 'string') return message;
    }

    return 'Não foi possível carregar suas tarefas.';
  }
}
