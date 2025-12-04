import { UpperCasePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { UIDiagonalLineComponent } from '../../ui';
import { Player } from '../../../models/player';
import { GameAction } from '../../../models/gameAction';
import { BASE_ACTIONS } from '../../const/baseActionsConfig';
import { InspectorService } from '../../services/inspector.service';

@Component({
  selector: 'app-actions-container',
  imports: [UpperCasePipe, UIDiagonalLineComponent],
  templateUrl: './actions-container.component.html',
  styleUrl: './actions-container.component.scss'
})
export class ActionsContainerComponent {
  public $player = input<Player | null>(null);
  public baseActions: GameAction[] = BASE_ACTIONS as GameAction[];
  public selectedAction: GameAction | null = null;

  constructor(private inspectorService: InspectorService) {
    console.log(this.baseActions);
  }

  public openInspector(action: GameAction): void {
    this.inspectorService.open({
      type: 'action-clicked',
      data: action
    })
  }
}
