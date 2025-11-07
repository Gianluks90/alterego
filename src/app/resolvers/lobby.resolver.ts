import { ResolveFn } from '@angular/router';
import { Archetype } from '../../models/player';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map } from 'rxjs';

interface LobbyData {
  archetypes: Archetype[];
  companies: any[];
}

export const lobbyResolver: ResolveFn<LobbyData> = (route, state) => {
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
