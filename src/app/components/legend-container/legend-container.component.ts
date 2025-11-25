import { Component } from '@angular/core';

@Component({
  selector: 'app-legend-container',
  imports: [],
  templateUrl: './legend-container.component.html',
  styleUrl: './legend-container.component.scss'
})
export class LegendContainerComponent {
  public legendItems = [
    {
      icons: ['looks_one', 'looks_two', 'looks_3'],
      description: '... Agenti'
    },
    {
      icons: ['counter_1', 'counter_2', 'counter_3'],
      description: '... Estranei'
    },
    {
      icons: ['category'],
      description: 'Strumento'
    },
    {
      icons: ['docs'],
      description: 'Collezionabile'
    },
    {
      icons: ['settings'],
      description: 'Allarme integrità scafo'
    },
    {
      icons: ['local_fire_department'],
      description: 'Allarme incendio'
    },
    {
      icons: ['keyboard'],
      description: 'Terminale'
    },
    {
      icons: ['error'],
      description: 'Area pericolosa'
    },
    {
      icons: ['lock'],
      description: 'Portellone chiuso'
    }
  ]
}
