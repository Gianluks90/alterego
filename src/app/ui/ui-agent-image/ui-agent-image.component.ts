import { Component, input } from '@angular/core';

@Component({
  selector: 'app-ui-agent-image',
  imports: [],
  templateUrl: './ui-agent-image.component.html',
  styleUrl: './ui-agent-image.component.scss'
})
export class UiAgentImageComponent {
  public width = input<number | string>('100%');
  public height = input<number | string>('100%');
  public faceId = input<string | null>(null);
  public notAvailable = input<boolean>(false);
}
