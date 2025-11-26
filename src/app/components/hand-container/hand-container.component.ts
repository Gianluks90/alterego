import { Component, input } from '@angular/core';

@Component({
  selector: 'app-hand-container',
  imports: [],
  templateUrl: './hand-container.component.html',
  styleUrl: './hand-container.component.scss'
})
export class HandContainerComponent {
  public label = input<string>('');
  public instrument = input<any>();

  constructor() {}
}
