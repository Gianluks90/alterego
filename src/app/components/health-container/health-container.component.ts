import { Component, input } from '@angular/core';
import { Player } from '../../../models/player';
import { UIDiagonalLineComponent } from '../../ui';
import { UpperCasePipe } from '@angular/common';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';

@Component({
  selector: 'app-health-container',
  imports: [UIDiagonalLineComponent, ProgressBarComponent, UpperCasePipe],
  templateUrl: './health-container.component.html',
  styleUrl: './health-container.component.scss'
})
export class HealthContainerComponent {
  public $player = input<Player | null>(null);
}
