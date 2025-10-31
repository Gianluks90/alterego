import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { appVersion } from '../../../../environment/appVersion';
import { DialogResult } from '../../../../models/dialogResult';

@Component({
  selector: 'app-help-dialog',
  imports: [],
  templateUrl: './help-dialog.component.html',
  styleUrl: './help-dialog.component.scss'
})
export class HelpDialogComponent {
  public dialogRef = inject<DialogRef<DialogResult,HelpDialogComponent>>(DialogRef);
  public appVersion: string = appVersion;
}
  