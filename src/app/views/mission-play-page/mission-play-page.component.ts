import { Component, inject, effect, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MissionService } from '../../services/mission.service';
import { GameStateService } from '../../services/game/game-state.service';
import { ActionExecutorService } from '../../services/game/action-executor.service';
import { SAMPLE_ACTION_TEST } from '../../const/sample-actions';
import { FirebaseService } from '../../services/firebase.service';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { DialogResult } from '../../../models/dialogResult';
import { DIALOGS_CONFIG, FULL_SIZE_DIALOG, SMALL_SIZE_DIALOG } from '../../const/dialogsConfig';
import { Mission } from '../../../models/mission';
import { Player } from '../../../models/player';
import { APP_TITLE_LINES } from '../../const/titleLines';
import { TabMenuContainerComponent } from '../../components/tab-menu-container/tab-menu-container.component';
import { ChatComponent } from '../../components/chat/chat.component';
import { AgentTagComponent } from '../../components/agent-tag/agent-tag.component';
import { UI_SOUNDS_DIRECTIVES } from '../../const/uiSounds';
import { ThemeToggleService } from '../../services/theme-toggle.service';
import { ProgressBarComponent } from '../../components/progress-bar/progress-bar.component';
import { InspectorService } from '../../services/inspector.service';
import { LegendContainerComponent } from '../../components/legend-container/legend-container.component';
import { ConfirmDialogComponent } from '../../components/dialogs/confirm-dialog/confirm-dialog.component';
import { UIDiagonalLineComponent } from '../../ui/ui-diagonal-line/ui-diagonal-line.component';
import { HandContainerComponent } from '../../components/hand-container/hand-container.component';
import { MapComponent } from '../../components/map/map.component';

@Component({
  selector: 'app-mission-play-page',
  templateUrl: './mission-play-page.component.html',
  styleUrl: './mission-play-page.component.scss',
  imports: [
    RouterLink,
    TabMenuContainerComponent,
    ChatComponent,
    AgentTagComponent,
    ProgressBarComponent,
    LegendContainerComponent,
    HandContainerComponent,
    MapComponent,
    UIDiagonalLineComponent,
    UI_SOUNDS_DIRECTIVES
]
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

  public missionId: string | null = null;

  public mission: Mission | null = null;
  public player: Player | null = null;

  public coordinates: { lat: number; lng: number } | null = null;

  @ViewChild('map') _map: MapComponent | null = null;

  // private baseOverlay: L.ImageOverlay | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private missionService: MissionService,
    private gameState: GameStateService,
    private executor: ActionExecutorService,
    private firebaseService: FirebaseService,
    private themeService: ThemeToggleService,
    private inspectorService: InspectorService
  ) {

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

  public confirmExit(): void {
    this.dialogRef = this.dialog.open(ConfirmDialogComponent, {
      ...DIALOGS_CONFIG,
    });

    this.dialogRef.closed.subscribe((result) => {
      if (result && result.status === 'confirmed') {
        this.router.navigate(['/missions']);
      }
    });
  }

  public onZoomIn(event: Event): void {
    event.stopPropagation();
    this._map?.zoomIn(event);
  }

  public onZoomOut(event: Event): void {
    event.stopPropagation();
    this._map?.zoomOut(event);
  }

  public onResetZoom(event: Event): void {
    event.stopPropagation();
    if (!this._map?.map) return;
    this._map.resetZoom(event);
  }
}