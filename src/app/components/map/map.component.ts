import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ThemeToggleService } from '../../services/theme-toggle.service';
import { InspectorService } from '../../services/inspector.service';
import * as L from 'leaflet';

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
  private markers: L.Marker[] = [];

  constructor(
    private route: ActivatedRoute,
    private themeService: ThemeToggleService,
    private inspectorService: InspectorService
  ) {
    this.route.data.subscribe((data) => {
      this.resolvedData = data['geoJson'];
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.themeService.theme$.subscribe(theme => {
      if (!this.map || !this.baseOverlay) return;
      const newUrl = `/map/ship_overlay_${theme === 'ibm' ? 'green' : theme}.png`;
      this.baseOverlay.setUrl(newUrl);
    });
  }

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
        fillColor: this.themeService.currentThemeColor || '#00ff00',
      }),
      onEachFeature: (feature, layer) => {
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

    this.supportMarkresCoordinates.forEach(coords => {
      this.initStarterMarker('support', coords);
    });
    this.bluePlayerMarkerCoordinates.forEach(coords => {
      this.initStarterMarker('skull', coords, 'lightblue');
    });
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
    if (!this.map) return;

    // const color = customColor ?? this.themeService.currentThemeColor ?? '#00ff00';
    const maskURL = "/map_markers/support.svg";

    const markerIcon = L.divIcon({
      html: `
    <span class="material-symbols-outlined start-marker-icon"
          style="color: ${customColor ?? 'white'}">
      ${icon}
    </span>
  `,
      className: '', // evita la classe "leaflet-div-icon"
    });

    const marker = L.marker([coordinates[0], coordinates[1]], { icon: markerIcon }).addTo(this.map);
    this.markers.push(marker);
    marker.bindPopup('Start Marker');
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
