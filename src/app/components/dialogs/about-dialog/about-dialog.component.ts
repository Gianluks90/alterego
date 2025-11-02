import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { APP_VERSION } from '../../../../environment/appVersion';
import { HelpDialogComponent } from '../help-dialog/help-dialog.component';

@Component({
  selector: 'app-about-dialog',
  imports: [],
  templateUrl: './about-dialog.component.html',
  styleUrl: './about-dialog.component.scss'
})
export class AboutDialogComponent {
  public dialogRef = inject<DialogRef<HelpDialogComponent>>(DialogRef);
  public appVersion: string = APP_VERSION;
}
