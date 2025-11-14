import { Injectable } from '@angular/core';
import { GameStateService } from './game-state.service';
import { ActionValidatorService } from './action-validator.service';
import { EffectRunnerService } from './effect-runner.service';
import { GameAction } from '../../../models/gameAction';

@Injectable({ providedIn: 'root' })
export class ActionExecutorService {
  constructor(
    private gameState: GameStateService,
    private validator: ActionValidatorService,
    private effectRunner: EffectRunnerService
  ) {}

  async execute(missionId: string, action: GameAction, actorId: string, params?: any) {
    const mission = this.gameState._mission();
    if (!mission || mission.id !== missionId) throw new Error('Mission mismatch');

    const actor = mission.playersData.find(p => p.uid === actorId);
    if (!actor) throw new Error('Actor not found');

    if (!this.validator.isUsable(action, actor, mission)) throw new Error('Action not usable');

    const costAp = action.cost?.ap ?? 0;
    actor.actionPoints = (actor.actionPoints ?? 0) - costAp;
    await this.gameState.updatePlayerData({ uid: actorId, actionPoints: actor.actionPoints });

    const snapshotBefore = JSON.parse(JSON.stringify(mission));
    try {
      for (const eff of action.effects) {
        await this.effectRunner.run(eff, { missionId, actorId, params, gameState: this.gameState });
      }
    } catch (err) {
      console.error('Action failed, rolling back', err);
      this.gameState.localPatch(snapshotBefore);
      throw err;
    }
  }
}
