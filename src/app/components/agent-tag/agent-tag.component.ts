import { Component, effect, input } from '@angular/core';
import { Player } from '../../../models/player';
import { ArchetypeGetIconPipe } from '../../pipes/archetype-get-icon.pipe';
import { UiAgentImageComponent } from '../../ui';

@Component({
  selector: 'app-agent-tag',
  imports: [ArchetypeGetIconPipe, UiAgentImageComponent],
  templateUrl: './agent-tag.component.html',
  styleUrl: './agent-tag.component.scss'
})
export class AgentTagComponent {
  public $player = input<Player | null>(null);
  public $showTitle = input<boolean>(true);
  public player: Player | null = null;

  constructor() {
    effect(() => {
      this.player = this.$player();
    });
  }
}
