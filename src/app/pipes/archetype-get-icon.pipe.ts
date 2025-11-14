import { Pipe, PipeTransform } from '@angular/core';
import { ARCHETYPES_DICT_ICONS } from '../const/roles';

@Pipe({
  name: 'archetypeGetIcon'
})
export class ArchetypeGetIconPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    const archetypeDict = ARCHETYPES_DICT_ICONS;
    if (typeof value === 'string' && archetypeDict[value]) {
      return archetypeDict[value];
    }
    return null;
  }
}
