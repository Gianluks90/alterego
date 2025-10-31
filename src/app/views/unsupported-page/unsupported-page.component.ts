import { Component } from '@angular/core';
import { TermLine } from '../../../models/termLine';

@Component({
  selector: 'app-unsupported-page',
  imports: [],
  templateUrl: './unsupported-page.component.html',
  styleUrl: './unsupported-page.component.scss'
})
export class UnsupportedPageComponent {
  public errorLines: TermLine[] = [
    { text: '[ERROR] DEVICE RESOLUTION OUT OF RANGE', delay: 800, class: 'term-line error-line' },
    { text: '[CAUSE] Mobile interface not supported', delay: 1200, class: 'term-line warning-line' },
    { text: 'Initiating safe mode...', delay: 1600, class: 'term-line' },
    { text: '[ACTION REQUIRED] Please switch to a larger display to continue.', delay: 2000, class: 'term-line' },
    { text: '[STATUS] System paused — awaiting reconnection.', delay: 2500, class: 'term-line system-line' },
  ];

}
