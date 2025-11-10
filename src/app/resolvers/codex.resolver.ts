import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { forkJoin, map } from 'rxjs';
import { Archetype } from '../../models/player';

interface CodexData {
  archetypes: Archetype[];
  companies: any[];
}

export const codexResolver: ResolveFn<CodexData> = (route, state) => {
  const http = inject(HttpClient);

  return forkJoin({
    archetypes: http.get('/configs/archetypesConfig.json'),
    companies: http.get('/configs/companiesConfig.json'),
    loreIndex: http.get('/configs/loreIndex.json')
  }).pipe(
    map((results) => ({
      archetypes: results.archetypes as Archetype[],
      companies: results.companies as any[],
      loreIndex: results.loreIndex as any[]
    }))
  );
};
