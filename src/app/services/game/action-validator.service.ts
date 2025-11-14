import { Injectable } from '@angular/core';
import { Mission } from '../../../models/mission';
import { Player } from '../../../models/player';
import { GameAction } from '../../../models/gameAction';

// HELP
// Controlla se un’azione può essere eseguita.
// Qui verifichi precondizioni e costi.

@Injectable({
  providedIn: 'root'
})
export class ActionValidatorService {
  isUsable(action: GameAction, player: Player, mission: Mission): boolean {
    if (!action) return false;
    const costAp = action.cost?.ap ?? 0;
    if ((player.actionPoints ?? 0) < costAp) return false;


    if (action.preconditions) {
      for (const pre of action.preconditions) {
        if (!this.checkPrecondition(pre, player, mission)) return false;
      }
    }
    return true;
  }


  private checkPrecondition(pre: any, player: Player, mission: Mission): boolean {
    switch (pre.type) {
      case 'hasItem':
        return player.inventory.items.some(i => i.id === pre.payload.itemId);
      case 'minAP':
        return (player.actionPoints ?? 0) >= (pre.payload.ap ?? 0);
      case 'notStatus':
        return !(player.parameters?.heavyWounds ?? []).includes(pre.payload.status);
      case 'allyInSameRoom': {
        // assume entities map contains players with pos
        const meEntity = mission.entities?.[`player_${player.uid}`];
        if (!meEntity) return false;
        const others = Object.values(mission.entities ?? {}).filter(e => e.type === 'player' && e.id !== `player_${player.uid}`);
        return others.some(o => o.pos?.[0] === meEntity.pos?.[0] && o.pos?.[1] === meEntity.pos?.[1]);
      }
      default:
        return true;
    }
  }
}
