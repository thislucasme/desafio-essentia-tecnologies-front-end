import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { TaskService } from '../../../../core/services/task';
import { Task, TaskStatus } from '../../models/task';

@Component({
  selector: 'app-task-dialog',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
  ],
  templateUrl: './task-dialog.html',
  styleUrl: './task-dialog.scss',
})
export class TaskDialog {
  private readonly taskService = inject(TaskService);
  private readonly dialogRef = inject(MatDialogRef<TaskDialog>);
  readonly task = inject<Task | null>(MAT_DIALOG_DATA, { optional: true });
  readonly isEditing = this.task !== null;

  readonly form = new FormGroup({
    title: new FormControl(this.task?.title ?? '', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(180)],
    }),

    description: new FormControl(this.task?.description ?? '', {
      nonNullable: true,
      validators: [Validators.maxLength(2000)],
    }),

    status: new FormControl<TaskStatus>(this.task?.status ?? 'PENDING', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.task) {
      this.taskService.update(this.task.id, this.form.getRawValue());
    } else {
      this.taskService.create(this.form.getRawValue());
    }

    this.dialogRef.close(true);
  }
}
