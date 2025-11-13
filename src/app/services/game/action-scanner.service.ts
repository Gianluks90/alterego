import { Injectable } from '@angular/core';
import { ActionValidatorService } from './action-validator.service';
import { Action, Player } from '../../../models/player';
import { Mission } from '../../../models/mission';

@Injectable({ providedIn: 'root' })
export class ActionScannerService {
  constructor(private validator: ActionValidatorService) {}

  getAvailableActions(player: Player, mission: Mission, baseActions: Action[]): Action[] {
    const fromHand = player.actions.hand ?? [];
    const fromArchetype = (player.archetype?.actions ?? [])
      .map(id => baseActions.find(a => a.id === id))
      .filter((a): a is Action => !!a);

    const candidates = [...baseActions, ...fromArchetype, ...fromHand];
    return candidates.filter(a => this.validator.isUsable(a, player, mission));
  }
}
