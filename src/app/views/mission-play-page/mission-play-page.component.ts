import { Component, inject, effect, HostListener } from '@angular/core';
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
import { ProgressBarComponent } from '../../components/progress-bar/progress-bar.component';
import { InspectorService } from '../../services/inspector.service';
import { LegendContainerComponent } from '../../components/legend-container/legend-container.component';

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
    UI_SOUNDS_DIRECTIVES
  ]
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
    private themeService: ThemeToggleService,
    private inspectorService: InspectorService
  ) {

    this.route.data.subscribe((data) => {
      this.resolvedData = data['geoJson'];
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

  private roomLayer: L.GeoJSON<any> | null = null;
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

    this.roomLayer = L.geoJSON(this.resolvedData.map, {
      style: feature => ({
        weight: 0,
        fillOpacity: feature?.properties.explored ? 0.1 : 0,
        fillColor: this.themeService.curremtThemeColor || '#00ff00',
      }),
      onEachFeature: (feature, layer) => {
        layer.on('click', (e) => {
          this.onRoomClick(feature.properties);
          this.inspectorService.open({
            type: 'room-clicked',
            data: feature.properties
          })
        });
      }
    }).addTo(this.map);

    // this.map.on('click', (e) => {
    //   // console.log("Cliccato sulla mappa in:", e.latlng);
    //   this.tempGeojsonCoordinates.push([parseInt(e.latlng.lng.toFixed(0)), parseInt(e.latlng.lat.toFixed(0))]);
    //   console.log(JSON.stringify(this.tempGeojsonCoordinates));
    // });
  }

  public onRoomClick(props: any) {
    console.log(`[${props.type.toUpperCase()}] ${props.name} (ID: ${props.id})`);
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

  public resetZoom(e: Event): void {
    e.stopPropagation();
    if (this.map) {
      this.map.setView([3000, 2000], -4);
    }
  }
}