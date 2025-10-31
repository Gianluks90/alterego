import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { DialogResult } from '../../../../models/dialogResult';

@Component({
  selector: 'app-delete-dialog',
  imports: [],
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.scss'
})
export class DeleteDialogComponent {
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
