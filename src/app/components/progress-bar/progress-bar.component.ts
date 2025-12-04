import { UpperCasePipe } from '@angular/common';
import { Component, effect, input } from '@angular/core';
import { InspectorService } from '../../services/inspector.service';

interface Segment {
  filled: boolean;
}

@Component({
  selector: 'app-progress-bar',
  imports: [UpperCasePipe],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.scss'
})
export class ProgressBarComponent {

  public min = input<number>(0);
  public max = input<number>(15);
  public current = input<number>(0);
  public icon = input<string | null>(null);
  public label = input<string | null>(null);
  public fullSize = input<boolean>(false);

  public iterableSegments: Segment[] = [];

  constructor(private inspectorService: InspectorService) {
    effect(() => {
      const max = this.max();
      const current = this.current();

      if (max == null) return;

      this.iterableSegments = Array.from({ length: max }).map((_, index) => ({
        filled: current != null ? index < current : false
      }));
    });
  }

  public openInspector(icon: string) {
    let label: string = '';
    let description: string = '';
    switch (icon) {
      case 'hourglass_empty':
        label = 'Conto alla rovescia per Salto';
        description = 'Indica il tempo rimanente prima del salto interstellare automatico della nave. Allarme: tutto l\'equipaggio deve essere in ibernazione o deve aver lasciato la nave prima del completamento del contatore. In caso contrario, si verificheranno sopraggiungerà la morte.';
        break;

      case 'settings':
        label = 'Allarme Integrità Scafo';
        description = 'Questo indicatore mostra lo stato attuale dell\'integrità dello scafo della nave. Se l\'integrità scende a zero, la nave subirà danni critici che potrebbero portare alla perdita di sistemi vitali e alla distruzione totale della nave.';
        break;

      case 'local_fire_department':
        label = 'Allarme Incendio a Bordo';
        description = 'Indica la presenza di incendi a bordo della nave. Gli incendi possono causare danni significativi ai sistemi della nave e rappresentano una minaccia per l\'equipaggio. È essenziale localizzare e spegnere gli incendi il prima possibile per garantire la sicurezza della nave e del suo equipaggio. Se non gestiti, gli incendi possono portare a guasti catastrofici dei sistemi e alla perdita della nave.';
        break;
    }
    this.inspectorService.open({
      type: 'info-clicked',
      data: {
        title: label,
        description: description,
        min: this.min(),
        max: this.max(),
        current: this.current()
      }
    })
  }

}
