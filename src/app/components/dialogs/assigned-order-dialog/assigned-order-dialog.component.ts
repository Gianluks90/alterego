import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { DialogResult } from '../../../../models/dialogResult';
import { HelpDialogComponent } from '../help-dialog/help-dialog.component';
import { UIDiagonalLineComponent, UiDialogContainerComponent } from '../../../ui';

@Component({
  selector: 'app-assigned-order-dialog',
  imports: [UiDialogContainerComponent, UIDiagonalLineComponent],
  templateUrl: './assigned-order-dialog.component.html',
  styleUrl: './assigned-order-dialog.component.scss'
})
export class AssignedOrderDialogComponent {
  public dialogRef = inject<DialogRef<DialogResult,HelpDialogComponent>>(DialogRef);
  public data = inject(DIALOG_DATA) as { order: number };
}
