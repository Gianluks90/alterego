import { UpperCasePipe } from '@angular/common';
import { Component, effect, input } from '@angular/core';

interface Segment {
  filled: boolean;
}

@Component({
  selector: 'app-progress-bar',
  imports: [UpperCasePipe],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.scss'
})
export class ProgressBarComponent {

  public min = input<number>(0);
  public max = input<number>(15);
  public current = input<number>(0);
  public icon = input<string | null>(null);
  public label = input<string | null>(null);

  public iterableSegments: Segment[] = [];

  constructor() {
    effect(() => {
      const max = this.max();
      const current = this.current();

      if (max == null) return;

      this.iterableSegments = Array.from({ length: max }).map((_, index) => ({
        filled: current != null ? index < current : false
      }));
    });
  }

}
