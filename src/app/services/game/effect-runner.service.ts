import { Injectable } from '@angular/core';
import { GameStateService } from './game-state.service';
import { Effect } from '../../const/effects';
import { Item } from '../../../models/player';


interface EffectContext {
  missionId: string;
  actorId: string;
  params?: any;
  gameState: GameStateService;
}


@Injectable({ providedIn: 'root' })
export class EffectRunnerService {
  constructor(private gameState: GameStateService) { }


  async run(effect: Effect, ctx: EffectContext): Promise<void> {
    const mission = this.gameState.mission();
    if (!mission) throw new Error('No mission');


    switch (effect.type) {

      case 'customTestLog': {
  console.log('TEST EFFECT:', effect.payload.message, ctx.params);
  return;
}
      case 'modifyStat': {
        const { targetId, stat, delta } = effect.payload;
        // targetId could be player uid or entity id
        if (targetId.startsWith('player_')) {
          const uid = targetId.replace('player_', '');
          const p = (mission.playersData ?? []).find(pp => pp.uid === uid);
          if (!p) throw new Error('Player not found');
          // support common stats
          if (stat === 'actionPoints') p.actionPoints = (p.actionPoints ?? 0) + delta;
          else if (stat === 'health') p.parameters.health = (p.parameters.health ?? 0) + delta;
          await this.gameState.updatePlayerData({ ...p });
        } else {
          // entity-level stat
          const ent = mission.entities?.[targetId];
          if (!ent) throw new Error('Entity not found');
          ent.meta = ent.meta ?? {};
          ent.meta[stat] = (ent.meta[stat] ?? 0) + delta;
          await this.gameState.commitMissionPatch({ entities: mission.entities });
        }
        break;
      }

      case 'consumeItem': {
        const { ownerId, itemId, amount = 1 } = effect.payload;
        const owner = (mission.playersData ?? []).find(p => p.uid === ownerId);
        if (!owner) throw new Error('Owner not found');
        const item = owner.inventory.items.find(i => i.id === itemId);
        if (!item) throw new Error('Item not found');
        if ((item.ammo ?? 0) < amount) throw new Error('Not enough ammo');
        item.ammo = (item.ammo ?? 0) - amount;
        await this.gameState.updatePlayerData({ uid: ownerId, inventory: owner.inventory });
        break;
      }

      case 'movePlayers': {
        const { playerIds, toEntityId } = effect.payload;
        const ent = mission.entities?.[toEntityId];
        if (!ent) throw new Error('Destination entity not found');
        for (const pid of playerIds) {
          const entId = `player_${pid}`;
          const pEntity = mission.entities?.[entId];
          if (!pEntity) continue;
          pEntity.pos = [...(ent.pos ?? [])] as [number, number];
        }
        await this.gameState.commitMissionPatch({ entities: mission.entities });
        break;
      }

      case 'applyStatus': {
        const { targetIds, status, duration } = effect.payload;
        for (const tid of targetIds) {
          if (tid.startsWith('player_')) {
            const uid = tid.replace('player_', '');
            const p = (mission.playersData ?? []).find(pp => pp.uid === uid);
            if (!p) continue;
            p.parameters.heavyWounds = p.parameters.heavyWounds ?? [];
            p.parameters.heavyWounds.push({ status, untilTurn: (mission.turnOwner ?? null), duration });
            await this.gameState.updatePlayerData({ uid, parameters: p.parameters });
          } else {
            // entity status
            const e = mission.entities?.[tid];
            if (!e) continue;
            e.meta = e.meta ?? {};
            e.meta.status = e.meta.status ?? [];
            e.meta.status.push({ status, duration });
            await this.gameState.commitMissionPatch({ entities: mission.entities });
          }
        }
        break;
      }

      case 'giveItem': {
        const { ownerId, item } = effect.payload as { ownerId: string; item: Item };
        const owner = (mission.playersData ?? []).find(p => p.uid === ownerId);
        if (!owner) throw new Error('Owner not found');
        owner.inventory.items.push(item);
        await this.gameState.updatePlayerData({ uid: ownerId, inventory: owner.inventory });
        break;
      }

      default:
        // custom or unhandled effects
        console.warn('Unhandled effect type', effect);
        break;
    }
  }
}