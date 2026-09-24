import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { Task } from '../../models/task';

@Component({
  selector: 'app-task-delete-dialog',
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle],
  templateUrl: './task-delete-dialog.html',
  styleUrl: './task-delete-dialog.scss',
})
export class TaskDeleteDialog {
  private readonly dialogRef = inject(MatDialogRef<TaskDeleteDialog>);
  readonly task = inject<Task>(MAT_DIALOG_DATA);

  confirm(): void {
    this.dialogRef.close(true);
  }
}
