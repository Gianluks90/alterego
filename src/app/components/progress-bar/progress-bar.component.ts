import { UpperCasePipe } from '@angular/common';
import { Component, effect, input } from '@angular/core';

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

  public progressPercentage: number = 0;

  constructor() {
    effect(() => {
      const current = this.current();
      this.progressPercentage = ((current - this.min()) / (this.max() - this.min())) * 100;
    });
  }

}
