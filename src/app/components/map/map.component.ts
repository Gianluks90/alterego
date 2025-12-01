import { Component, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ThemeToggleService } from '../../services/theme-toggle.service';
import { InspectorService } from '../../services/inspector.service';
import * as L from 'leaflet';
import { GameStateService } from '../../services/game/game-state.service';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent {
  private resolvedData: any;
  private baseOverlay: L.ImageOverlay | null = null;
  public map: L.Map | null = null;
  public realTimeCoordinates: { lat: number; lng: number } | null = { lat: 0, lng: 0 };
  private markers: L.Marker[] = [];

  constructor(
    private route: ActivatedRoute,
    private themeService: ThemeToggleService,
    private inspectorService: InspectorService,
    private gameService: GameStateService
  ) {
    this.route.data.subscribe((data) => {
      this.resolvedData = data['geoJson'];
    });

    effect(() => {
      if (!this.gameService._mission()) return;
      this.initMap();
      this.themeService.theme$.subscribe(theme => {
        if (!this.map || !this.baseOverlay) return;
        const newUrl = `/map/ship_overlay_${theme === 'ibm' ? 'green' : theme}.png`;
        this.baseOverlay.setUrl(newUrl);
      });
    });
  }

  private roomLayer: L.GeoJSON<any> | null = null;
  private roomLayersMap = new Map<string, L.Layer>();
  private initMap(): void {
    if (this.map) return;
    const bounds: L.LatLngBoundsExpression = [[0, 0], [6000, 4000]];

    this.map = L.map('map', {
      crs: L.CRS.Simple,
      center: [3000, 2000],
      zoom: -2,
      maxZoom: -1,
      minZoom: -4,
      doubleClickZoom: false,
      attributionControl: false,
      zoomControl: false,
    });

    this.map.setMaxBounds([[-10000, -10000], [10000, 10000]]);
    this.baseOverlay = L.imageOverlay(
      `/map/ship_overlay_${this.themeService.currentTheme === 'ibm' ? 'green' : this.themeService.currentTheme}.png`,
      bounds
    ).addTo(this.map);

    this.roomLayer = L.geoJSON(this.resolvedData.map, {
      style: feature => ({
        weight: 0,
        fillOpacity: feature?.properties.explored ? 0.1 : 0,
        fillColor: this.themeService.currentThemeColor || '#00ff00',
      }),
      onEachFeature: (feature, layer) => {
        const roomId = feature.properties.id;
        this.roomLayersMap.set(roomId, layer);
        layer.on('click', (e) => {
          this.onRoomClick(feature.properties);
          this.inspectorService.open({
            type: feature.properties.type === 'room' ? 'room-clicked' : 'corridor-clicked',
            data: feature.properties
          })
        });
      }
    }).addTo(this.map);

    this.map.on('click', (e) => {
      console.log('click on map:', e.latlng.lat.toFixed() + ' ' + e.latlng.lng.toFixed());
    });

    this.map.on('mousemove', (e) => {
        this.realTimeCoordinates = { lat: e.latlng.lat, lng: e.latlng.lng };
    })

    this.supportMarkresCoordinates.forEach(coords => {
      this.initStarterMarker('support', coords);
    });
    this.bluePlayerMarkerCoordinates.forEach(coords => {
      this.initStarterMarker('skull', coords, 'lightblue');
    });

    // Spawn dei player dalla missione
    const mission = this.gameService._mission();
    if (mission?.playersData) {
      mission.playersData.forEach(async player => {

       if (player.position && typeof player.position.offsetX === 'number' && typeof player.position.offsetY === 'number') {              
          const layer = this.roomLayersMap.get(player.position.roomId);
          if (layer) {            
            const base = (layer as L.Polygon).getBounds().getSouthWest();
            const x = base.lat + player.position.offsetX;
            const y = base.lng + player.position.offsetY;

            this.initStarterMarker(
              `looks_${player.order === 1 ? 'one' : player.order === 2 ? 'two' : player.order}`,
              [x, y],
              'white'
            );
          }
          return;
        }

        // Altrimenti generiamo una nuova posizione
        const roomId = player.position?.roomId ?? "R_02";
        const pos = this.generateRandomPositionsForRoom(roomId, 1)[0];

        if (pos) {
          const layer = this.roomLayersMap.get(roomId);
          if (layer) {
            const base = (layer as L.Polygon).getBounds().getSouthWest();
            const offsetX = pos.lat - base.lat;
            const offsetY = pos.lng - base.lng;

            // Salviamo la posizione nel GameService
            await this.gameService.assignInitialPlayerPosition(player, roomId, offsetX, offsetY);
          }

          this.initStarterMarker(
            `looks_${player.order === 1 ? 'one' : player.order === 2 ? 'two' : player.order}`,
            [pos.lat, pos.lng],
            'white'
          );
        }
      });
    }
  }

  private supportMarkresCoordinates = [
    [4232, 224],
    [3860, 224],
    [4239, 3689],
    [3860, 3689]
  ];

  private bluePlayerMarkerCoordinates = [
    [2622, 1950],
  ];

  private initStarterMarker(icon: string, coordinates: number[], customColor?: string): void {
    console.log('icon', icon);
    
    if (!this.map) return;
    const markerIcon = L.divIcon({
      html: `
    <span class="material-symbols-outlined start-marker-icon"
          style="color: ${customColor ?? 'white'}">
      ${icon}
    </span>
  `,
      className: '',
    });

    const marker = L.marker([coordinates[0], coordinates[1]], { icon: markerIcon }).addTo(this.map);
    this.markers.push(marker);
  }

  private getRandomPointInLayer(layer: any): L.LatLng {
  const bounds = layer.getBounds();

  const margin = 100; // <-- margine interno. Puoi aumentarlo o diminuirlo

  const shrinkSouth = bounds.getSouth() + margin;
  const shrinkNorth = bounds.getNorth() - margin;
  const shrinkWest  = bounds.getWest() + margin;
  const shrinkEast  = bounds.getEast() - margin;

  let point: L.LatLng;

  const polygon = L.polygon(layer.getLatLngs());

  function isPointInPolygon(point: L.LatLng, polygon: L.Polygon): boolean {
    const latlngs = polygon.getLatLngs() as L.LatLng[] | L.LatLng[][];
    const polyPoints = Array.isArray(latlngs[0]) ? latlngs[0] as L.LatLng[] : latlngs as L.LatLng[];

    let inside = false;
    for (let i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
      const xi = polyPoints[i].lat, yi = polyPoints[i].lng;
      const xj = polyPoints[j].lat, yj = polyPoints[j].lng;
      const intersect = ((yi > point.lng) !== (yj > point.lng)) &&
        (point.lat < (xj - xi) * (point.lng - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  do {
    const lat = shrinkSouth + Math.random() * (shrinkNorth - shrinkSouth);
    const lng = shrinkWest  + Math.random() * (shrinkEast  - shrinkWest);
    point = L.latLng(lat, lng);
  } while (!isPointInPolygon(point, polygon));

  return point;
}

  public generateRandomPositionsForRoom(roomId: string, count: number): L.LatLng[] {
    const layer = this.roomLayersMap.get(roomId);
    if (!layer) return [];

    const positions: L.LatLng[] = [];
    for (let i = 0; i < count; i++) {
      positions.push(this.getRandomPointInLayer(layer));
    }
    return positions;
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
