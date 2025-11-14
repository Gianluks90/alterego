import { Component, inject, signal, computed, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MissionService } from '../../services/mission.service';
import { GameStateService } from '../../services/game/game-state.service';
import { ActionExecutorService } from '../../services/game/action-executor.service';
import { JsonPipe, NgIf } from '@angular/common';
import { SAMPLE_ACTION_TEST } from '../../const/sample-actions';
import { FirebaseService } from '../../services/firebase.service';
import { AppUser } from '../../../models/appUser';

@Component({
  selector: 'app-mission-play-page',
  templateUrl: './mission-play-page.component.html',
  styleUrl: './mission-play-page.component.scss',
  imports: [NgIf, JsonPipe]
})
export class MissionPlayPageComponent {

  private route = inject(ActivatedRoute);
  private missionService = inject(MissionService);
  private gameState = inject(GameStateService);
  private executor = inject(ActionExecutorService);
  private firebaseService = inject(FirebaseService);

  mission = this.gameState.missionView;   // signal combinata
  player = this.gameState.player;         // signal con il mio playerData
  user: AppUser | null = null;
  ready = computed(() => !!this.mission() && !!this.player() && !!this.user);

  constructor() {
    // 🚀 1. Carico missione e player
    const missionId = this.route.snapshot.paramMap.get('id');
    const userId = this.firebaseService.$user()?.uid;

    if (missionId && userId) {
      console.log('INIT');
      
      this.missionService.getMissionById(missionId);
      this.missionService.getPlayerData(missionId, userId);
    }

    effect(() => {
      this.user = this.firebaseService.$user(); // dipendenza
      console.log(this.user);
      
    })

    // Debug reattivo
    effect(() => {
      if (this.mission()) {
        console.log('[Mission PLAY] Stato aggiornato:', this.mission());
      }
    });
  }

  // 🔥 Azione di test
  async doTestAction() {
    const mission = this.mission();
    const player = this.player();
    if (!mission || !player) return;

    console.log('Eseguo TEST ACTION...');
    await this.executor.execute(mission.id, SAMPLE_ACTION_TEST, player.uid, {
      coolMessage: 'Funziona cazzo 💪🦖'
    });
  }
}