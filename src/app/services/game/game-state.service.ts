import { Injectable, computed, effect, signal } from '@angular/core';
import { Mission } from '../../../models/mission';
import { MissionService } from '../mission.service';
import { Player } from '../../../models/player';

@Injectable({ providedIn: 'root' })
export class GameStateService {
  // Stato locale derivato dal MissionService
  _mission = computed(() => this.missionService.$selectedMission());
  _player = computed(() => this.missionService.$selectedPlayerData());

  // Stato interno (patch locali non ancora scritte)
  private _localPatch = signal<Partial<Mission> | null>(null);

  // Stato combinato (missione corrente + patch locale)
  missionView = computed(() => {
    const base = this._mission();
    const patch = this._localPatch();
    return base ? { ...base, ...(patch ?? {}) } : null;
  });

  // Computed utile per UI
  myTurn = computed(() => {
    const mission = this.missionView();
    const me = this._player();
    if (!mission || !me) return false;
    // esempio: controlla se il turno è mio
    return mission['turnOwner'] === me.uid;
  });

  constructor(private missionService: MissionService) {
    // Effetto per log di debug
    effect(() => {
      const m = this.missionView();
      if (m) console.log('[Mission updated]', m.status, m.playersData?.length);
    });
  }

  // Patch locale non sincronizzata
  localPatch(partial: Partial<Mission>) {
    const cur = this._localPatch();
    this._localPatch.set({ ...(cur ?? {}), ...partial });
  }

  // Reset patch locale
  clearLocalPatch() {
    this._localPatch.set(null);
  }

  // Scrittura persistente
  async commitMissionPatch(partial: Partial<Mission>) {
    const mission = this._mission();
    if (!mission) throw new Error('No mission loaded');
    await this.missionService.launchMission(mission.id); // esempio
  }

  async updatePlayerData(partialPlayer: Partial<Player>) {
    const mission = this._mission();
    const player = this._player();
    if (!mission || !player) return;
    await this.missionService.updatePlayerData(mission.id, player.uid, partialPlayer);
  }

  async assignInitialPlayerPosition(player: Player, roomId: string, x: number, y: number) {
    if (player.position && player.position.offsetX !== 0 && player.position.offsetY !== 0) return;
    await this.updatePlayerData({
      position: {
        roomId: roomId,
        offsetX: x,
        offsetY: y
      }
    });
  }
}
