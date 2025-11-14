import { Injectable } from '@angular/core';
import { ActionValidatorService } from './action-validator.service';
import { Player } from '../../../models/player';
import { Mission } from '../../../models/mission';
import { GameAction } from '../../../models/gameAction';

@Injectable({ providedIn: 'root' })
export class ActionScannerService {
  constructor(private validator: ActionValidatorService) {}

  getAvailableActions(player: Player, mission: Mission, baseActions: GameAction[]): GameAction[] {
    const fromHand = player.actions.hand ?? [];
    const fromArchetype = (player.archetype?.actions ?? [])
      .map(id => baseActions.find(a => a.id === id))
      .filter((a): a is GameAction => !!a);

    const candidates = [...baseActions, ...fromArchetype, ...fromHand];
    return candidates.filter(a => this.validator.isUsable(a, player, mission));
  }
}
