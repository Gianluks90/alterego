import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { DialogResult } from '../../../../models/dialogResult';
import { UiDialogContainerComponent } from '../../../ui';

@Component({
  selector: 'app-help-dialog',
  imports: [UiDialogContainerComponent],
  templateUrl: './help-dialog.component.html',
  styleUrl: './help-dialog.component.scss'
})
export class HelpDialogComponent {
  public dialogRef = inject<DialogRef<DialogResult,HelpDialogComponent>>(DialogRef);
}
  