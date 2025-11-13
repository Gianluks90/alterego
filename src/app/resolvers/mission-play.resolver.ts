import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { forkJoin, map } from 'rxjs';
import { Action, Archetype } from '../../models/player';

interface MissionPlayData {
  archetypes: Archetype[];
  companies: any[];
}

export const missionPlayResolver: ResolveFn<MissionPlayData> = (route, state) => {
  const http = inject(HttpClient);

  return forkJoin({
    archetypes: http.get('/configs/archetypesConfig.json'),
    companies: http.get('/configs/companiesConfig.json')
  }).pipe(
    map((results) => ({
      archetypes: results.archetypes as Archetype[],
      companies: results.companies as any[]
    }))
  );
};
