import { Injectable, computed, effect, signal } from '@angular/core';
import { Mission } from '../../../models/mission';
import { MissionService } from '../mission.service';
import { Player } from '../../../models/player';

@Injectable({ providedIn: 'root' })
export class GameStateService {
  // Stato locale derivato dal MissionService
  mission = computed(() => this.missionService.$selectedMission());
  player = computed(() => this.missionService.$selectedPlayerData());

  // Stato interno (patch locali non ancora scritte)
  private _localPatch = signal<Partial<Mission> | null>(null);

  // Stato combinato (missione corrente + patch locale)
  missionView = computed(() => {
    const base = this.mission();
    const patch = this._localPatch();
    return base ? { ...base, ...(patch ?? {}) } : null;
  });

  // Computed utile per UI
  myTurn = computed(() => {
    const mission = this.missionView();
    const me = this.player();
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
    const mission = this.mission();
    if (!mission) throw new Error('No mission loaded');
    await this.missionService.launchMission(mission.id); // esempio
  }

  async updatePlayerData(partialPlayer: Partial<Player>) {
    const mission = this.mission();
    const player = this.player();
    if (!mission || !player) return;
    // await this.missionService.completeAgentSetup(mission.id, player.uid, partialPlayer);
    console.log('risultato');
    
  }
}
