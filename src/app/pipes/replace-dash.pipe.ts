import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceDash'
})
export class ReplaceDashPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if (typeof value === 'string') {
      return value.replace(/-/g, ' ');
    }
    return null;
  }

}
