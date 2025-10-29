import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-help-dialog',
  imports: [],
  templateUrl: './help-dialog.component.html',
  styleUrl: './help-dialog.component.scss'
})
export class HelpDialogComponent {
  public dialogRef = inject<DialogRef<HelpDialogComponent>>(DialogRef);
}
