import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { DialogResult } from '../../../../models/dialogResult';
import { HelpDialogComponent } from '../help-dialog/help-dialog.component';
import { UiDialogContainerComponent } from '../../../ui';

@Component({
  selector: 'app-help-lobby-dialog',
  imports: [UiDialogContainerComponent],
  templateUrl: './help-lobby-dialog.component.html',
  styleUrl: './help-lobby-dialog.component.scss'
})
export class HelpLobbyDialogComponent {
  public dialogRef = inject<DialogRef<DialogResult,HelpDialogComponent>>(DialogRef);

}
