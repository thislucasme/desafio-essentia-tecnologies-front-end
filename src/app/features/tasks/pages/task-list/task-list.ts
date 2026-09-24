import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { TaskService } from '../../../../core/services/task.service';
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
export class TaskList implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly dialog = inject(MatDialog);

  readonly tasks = this.taskService.tasks;
  readonly totalItems = this.taskService.totalItems;
  readonly totalPages = this.taskService.totalPages;
  readonly isLoading = this.taskService.isLoading;
  readonly errorMessage = this.taskService.errorMessage;
  readonly pageSize = 2;
  readonly currentPage = signal(1);
  readonly statusLabels: Record<TaskStatus, string> = {
    PENDING: 'Pendente',
    IN_PROGRESS: 'Em andamento',
    DONE: 'Concluída',
  };

  ngOnInit(): void {
    void this.loadPage(1);
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(TaskDialog, {
      width: '560px',
      maxWidth: 'calc(100vw - 32px)',
      panelClass: 'task-dialog-panel',
    });

    dialogRef.afterClosed().subscribe((saved) => {
      if (saved) void this.loadPage(1);
    });
  }

  openEditDialog(task: Task): void {
    const dialogRef = this.dialog.open(TaskDialog, {
      width: '560px',
      maxWidth: 'calc(100vw - 32px)',
      panelClass: 'task-dialog-panel',
      data: task,
    });

    dialogRef.afterClosed().subscribe((saved) => {
      if (saved) void this.loadPage(this.currentPage());
    });
  }

  deleteTask(task: Task): void {
    const dialogRef = this.dialog.open(TaskDeleteDialog, {
      width: '440px',
      maxWidth: 'calc(100vw - 32px)',
      data: task,
    });

    dialogRef.afterClosed().subscribe(async (confirmed) => {
      if (confirmed) {
        await this.taskService.delete(task.id);
        const destinationPage =
          this.tasks().length === 1 ? Math.max(1, this.currentPage() - 1) : this.currentPage();
        await this.loadPage(destinationPage);
      }
    });
  }

  async advanceStatus(task: Task): Promise<void> {
    const nextStatus: Record<TaskStatus, TaskStatus> = {
      PENDING: 'IN_PROGRESS',
      IN_PROGRESS: 'DONE',
      DONE: 'PENDING',
    };

    await this.taskService.changeStatus(task.id, nextStatus[task.status]);
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
    void this.loadPage(Math.max(1, this.currentPage() - 1));
  }

  nextPage(): void {
    void this.loadPage(Math.min(this.totalPages(), this.currentPage() + 1));
  }

  loadPage(page: number): Promise<void> {
    this.currentPage.set(page);
    return this.taskService.findAll(page, this.pageSize);
  }
}
