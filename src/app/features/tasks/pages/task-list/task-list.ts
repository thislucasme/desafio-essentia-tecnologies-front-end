import { DatePipe } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { TaskService } from '../../../../core/services/task';
import { Header } from '../../../../shared/components/header/header';
import { TaskDeleteDialog } from '../../components/task-delete-dialog/task-delete-dialog';
import { TaskDialog } from '../../components/task-dialog/task-dialog';
import { Task, TaskStatus } from '../../models/task';

@Component({
  selector: 'app-task-list',
  imports: [DatePipe, Header, MatButtonModule, MatIconModule],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList {
  private readonly taskService = inject(TaskService);
  private readonly dialog = inject(MatDialog);

  readonly tasks = this.taskService.tasks;
  readonly pageSize = 2;
  readonly currentPage = signal(1);
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.tasks().length / this.pageSize)));
  readonly paginatedTasks = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.tasks().slice(start, start + this.pageSize);
  });
  readonly statusLabels: Record<TaskStatus, string> = {
    PENDING: 'Pendente',
    IN_PROGRESS: 'Em andamento',
    DONE: 'Concluída',
  };

  constructor() {
    effect(() => {
      const lastPage = this.totalPages();

      if (this.currentPage() > lastPage) {
        this.currentPage.set(lastPage);
      }
    });
  }

  openCreateDialog(): void {
    this.dialog.open(TaskDialog, {
      width: '500px',
      maxWidth: 'calc(100vw - 32px)',
    });
  }

  openEditDialog(task: Task): void {
    this.dialog.open(TaskDialog, {
      width: '500px',
      maxWidth: 'calc(100vw - 32px)',
      data: task,
    });
  }

  deleteTask(task: Task): void {
    const dialogRef = this.dialog.open(TaskDeleteDialog, {
      width: '440px',
      maxWidth: 'calc(100vw - 32px)',
      data: task,
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.taskService.delete(task.id);
      }
    });
  }

  advanceStatus(task: Task): void {
    const nextStatus: Record<TaskStatus, TaskStatus> = {
      PENDING: 'IN_PROGRESS',
      IN_PROGRESS: 'DONE',
      DONE: 'PENDING',
    };

    this.taskService.changeStatus(task.id, nextStatus[task.status]);
  }

  statusActionLabel(status: TaskStatus): string {
    const labels: Record<TaskStatus, string> = {
      PENDING: 'Iniciar tarefa',
      IN_PROGRESS: 'Concluir tarefa',
      DONE: 'Reabrir tarefa',
    };

    return labels[status];
  }

  previousPage(): void {
    this.currentPage.update((page) => Math.max(1, page - 1));
  }

  nextPage(): void {
    this.currentPage.update((page) => Math.min(this.totalPages(), page + 1));
  }
}
