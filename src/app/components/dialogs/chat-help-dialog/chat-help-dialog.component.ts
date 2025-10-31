import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { DialogResult } from '../../../../models/dialogResult';

@Component({
  selector: 'app-chat-help-dialog',
  imports: [],
  templateUrl: './chat-help-dialog.component.html',
  styleUrl: './chat-help-dialog.component.scss'
})
export class ChatHelpDialogComponent {
  public dialogRef = inject<DialogRef<DialogResult, ChatHelpDialogComponent>>(DialogRef);

}
