import { Component, input } from '@angular/core';
import { UIDiagonalLineComponent } from '../ui-diagonal-line/ui-diagonal-line.component';

@Component({
  selector: 'app-ui-dialog-container',
  imports: [UIDiagonalLineComponent],
  templateUrl: './ui-dialog-container.component.html',
  styleUrl: './ui-dialog-container.component.scss'
})
export class UiDialogContainerComponent {
  public dialogTitle = input<string>('Dialog Title');
}
