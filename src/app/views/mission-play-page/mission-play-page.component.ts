import { Component, inject, computed, effect, HostListener } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MissionService } from '../../services/mission.service';
import { GameStateService } from '../../services/game/game-state.service';
import { ActionExecutorService } from '../../services/game/action-executor.service';
import { NgIf } from '@angular/common';
import { SAMPLE_ACTION_TEST } from '../../const/sample-actions';
import { FirebaseService } from '../../services/firebase.service';
import { AppUser } from '../../../models/appUser';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { DialogResult } from '../../../models/dialogResult';
import { FULL_SIZE_DIALOG, SMALL_SIZE_DIALOG } from '../../const/dialogsConfig';
import { Mission } from '../../../models/mission';
import { Player } from '../../../models/player';
import { APP_TITLE_LINES } from '../../const/titleLines';
import { TabMenuContainerComponent } from '../../components/tab-menu-container/tab-menu-container.component';
import { ChatComponent } from '../../components/chat/chat.component';

@Component({
  selector: 'app-mission-play-page',
  templateUrl: './mission-play-page.component.html',
  styleUrl: './mission-play-page.component.scss',
  imports: [RouterLink, TabMenuContainerComponent, ChatComponent]
})
export class MissionPlayPageComponent {

  public titleLines = APP_TITLE_LINES;
  private dialog = inject(Dialog);
  private dialogRef: DialogRef<DialogResult, any> | null = null;
  public windowSize: number = window.innerWidth;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.windowSize = event.target.innerWidth;
    this.dialogRef?.updateSize(this.windowSize <= 768 ? FULL_SIZE_DIALOG : SMALL_SIZE_DIALOG);
  }

  private resolvedData: any;
  public missionId: string | null = null;

  public mission: Mission | null = null;
  public player: Player | null = null;

  // private route = inject(ActivatedRoute);
  // private missionService = inject(MissionService);
  // private gameState = inject(GameStateService);
  // private executor = inject(ActionExecutorService);
  // private firebaseService = inject(FirebaseService);

  // mission = this.gameState.missionView;   // signal combinata
  // player = this.gameState.player;         // signal con il mio playerData
  // user: AppUser | null = null;
  // ready = computed(() => !!this.mission() && !!this.player() && !!this.user);

  constructor(
    private route: ActivatedRoute,
    private missionService: MissionService,
    private gameState: GameStateService,
    private executor: ActionExecutorService,
    private firebaseService: FirebaseService
  ) {

    this.route.data.subscribe((data) => {
      this.resolvedData = data['resolved'];
    });

    this.route.paramMap.subscribe((params) => {
      this.missionId = params.get('id');
    });

    effect(() => {
      const user = this.firebaseService.$user();
      if (user && this.missionId) {
        this.missionService.getPlayerData(this.missionId, user.uid);
      }
    })

    effect(() => {
      const { mission, player, ready } = this.missionService._lobbyState();

      if (!ready) return;

      this.player = player;
      this.mission = mission;
    });
  }

  ngOnInit(): void {
    this.missionService.getMissionById(this.missionId!);
  }

  // 🔥 Azione di test
  async doTestAction() {
    const mission = this.mission;
    const player = this.player;
    if (!mission || !player) return;

    console.log('Eseguo TEST ACTION...');
    await this.executor.execute(mission.id, SAMPLE_ACTION_TEST, player.uid, {
      coolMessage: 'Funziona cazzo 💪🦖'
    });
  }
}