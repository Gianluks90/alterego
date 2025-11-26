import { Component, ElementRef, ViewChild } from '@angular/core';
import { UIDiagonalLineComponent } from '../../ui/ui-diagonal-line/ui-diagonal-line.component';

@Component({
  selector: 'app-legend-container',
  imports: [UIDiagonalLineComponent],
  templateUrl: './legend-container.component.html',
  styleUrl: './legend-container.component.scss'
})
export class LegendContainerComponent {

  @ViewChild('legendDetails') legendDetails!: ElementRef<HTMLDetailsElement>;

  ngAfterViewInit() {
    document.addEventListener('click', (event) => {
      const details = this.legendDetails?.nativeElement;
      if (
        details &&
        details.open &&
        !details.contains(event.target as Node)
      ) {
        details.open = false;
      }
    });
  }

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
      icons: ['support'],
      description: 'Capsula di salvataggio'
    },
    {
      icons: ['error'],
      description: 'Area pericolosa'
    },
    {
      icons: ['lock'],
      description: 'Portellone chiuso'
    }
  ];
}
