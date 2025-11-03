import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { DialogResult } from '../../../../models/dialogResult';

@Component({
  selector: 'app-confirm-dialog',
  imports: [],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
  public dialogRef = inject<DialogRef<DialogResult>>(DialogRef);

  public confirm(): void {
    this.dialogRef.close({
      status: 'confirmed',
    });
  }

  public cancel(): void {
    this.dialogRef.close({
      status: 'cancelled',
    });
  }
}
