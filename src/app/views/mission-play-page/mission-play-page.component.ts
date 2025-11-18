import { Component, inject, computed, effect, HostListener } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MissionService } from '../../services/mission.service';
import { GameStateService } from '../../services/game/game-state.service';
import { ActionExecutorService } from '../../services/game/action-executor.service';
import { SAMPLE_ACTION_TEST } from '../../const/sample-actions';
import { FirebaseService } from '../../services/firebase.service';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { DialogResult } from '../../../models/dialogResult';
import { FULL_SIZE_DIALOG, SMALL_SIZE_DIALOG } from '../../const/dialogsConfig';
import { Mission } from '../../../models/mission';
import { Player } from '../../../models/player';
import { APP_TITLE_LINES } from '../../const/titleLines';
import { TabMenuContainerComponent } from '../../components/tab-menu-container/tab-menu-container.component';
import { ChatComponent } from '../../components/chat/chat.component';
import { AgentTagComponent } from '../../components/agent-tag/agent-tag.component';
import { UI_SOUNDS_DIRECTIVES } from '../../const/uiSounds';
import * as L from 'leaflet';
import { ThemeToggleService } from '../../services/theme-toggle.service';

@Component({
  selector: 'app-mission-play-page',
  templateUrl: './mission-play-page.component.html',
  styleUrl: './mission-play-page.component.scss',
  imports: [RouterLink, TabMenuContainerComponent, ChatComponent, AgentTagComponent, UI_SOUNDS_DIRECTIVES]
})
export class MissionPlayPageComponent {

  public titleLines = APP_TITLE_LINES;
  private dialog = inject(Dialog);
  private dialogRef: DialogRef<DialogResult, any> | null = null;
  public windowSize: number = window.innerWidth;
  public map: L.Map | null = null;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.windowSize = event.target.innerWidth;
    this.dialogRef?.updateSize(this.windowSize <= 768 ? FULL_SIZE_DIALOG : SMALL_SIZE_DIALOG);
  }

  private resolvedData: any;
  public missionId: string | null = null;

  public mission: Mission | null = null;
  public player: Player | null = null;

  private baseOverlay: L.ImageOverlay | null = null;

  constructor(
    private route: ActivatedRoute,
    private missionService: MissionService,
    private gameState: GameStateService,
    private executor: ActionExecutorService,
    private firebaseService: FirebaseService,
    private themeService: ThemeToggleService
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

  ngAfterViewInit(): void {
    this.initMap();
    this.themeService.theme$.subscribe(theme => {
      if (!this.map || !this.baseOverlay) return;
      const newUrl = `/map/ship_overlay_${theme === 'ibm' ? 'green' : theme}.png`;
      this.baseOverlay.setUrl(newUrl);
    });
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

  // MAP

  private initMap(): void {

    const bounds: L.LatLngBoundsExpression = [[0, 0], [6000, 4000]];

    this.map = L.map('map', {
      crs: L.CRS.Simple,
      center: [3000, 2000],
      zoom: -4,
      maxZoom: -1,
      minZoom: -4,
      doubleClickZoom: false,
      attributionControl: false,
      zoomControl: false,
    });

    this.map.setMaxBounds(bounds);
    this.baseOverlay = L.imageOverlay(
      `/map/ship_overlay_${this.themeService.currentTheme === 'ibm' ? 'green' : this.themeService.currentTheme}.png`,
      bounds
    ).addTo(this.map);
  }

  public zoomIn(e: Event): void {
    e.stopPropagation();
    if (this.map) {
      this.map.zoomIn();
    }
  }

  public zoomOut(e: Event): void {
    e.stopPropagation();
    if (this.map) {
      this.map.zoomOut();
    }
  }
}