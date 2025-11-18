import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { forkJoin, map } from 'rxjs';

interface GeoJsonData {
  map: any;
}

export const geojsonResolver: ResolveFn<GeoJsonData> = (route, state) => {
  const http = inject(HttpClient);

  return forkJoin({
    map: http.get('/configs/ship.geojson')
  }).pipe(
    map((results) => ({
      map: results.map
    }))
  );
};
