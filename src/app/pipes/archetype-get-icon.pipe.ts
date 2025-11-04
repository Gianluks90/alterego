import { Pipe, PipeTransform } from '@angular/core';
import { ARCHETYPES_DICT_ICONS } from '../../environment/roles';

@Pipe({
  name: 'archetypeGetIcon'
})
export class ArchetypeGetIconPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    const archetypeDict = ARCHETYPES_DICT_ICONS;
    console.log('pipe', value);
    
    if (typeof value === 'string' && archetypeDict[value]) {
      return archetypeDict[value];
    }
    return null;
  }
}
