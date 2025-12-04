import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'agentLabel',
  standalone: true
})
export class AgentLabelPipe implements PipeTransform {

  transform(player: { order?: number } | null | undefined, formValue: any): string {
    const name = formValue?.name || '';
    const surname = formValue?.surname || '';
    const hasName = name.trim() || surname.trim();

    const fullName = hasName ? `${name} ${surname}`.trim() : '[ SCONOSCIUTO ]';
    const orderPart = typeof player?.order === 'number' ? ` ${player.order}` : '';

    return `Agente${orderPart} ${fullName} [Sessione privata]`;
  }
}