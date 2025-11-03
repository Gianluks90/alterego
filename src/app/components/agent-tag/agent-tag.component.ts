import { Component, effect, input } from '@angular/core';
import { Player } from '../../../models/player';

@Component({
  selector: 'app-agent-tag',
  imports: [],
  templateUrl: './agent-tag.component.html',
  styleUrl: './agent-tag.component.scss'
})
export class AgentTagComponent {
  public $player = input<Player | null>(null);
  public player: Player | null = null;

  constructor() {
    effect(() => {
      this.player = this.$player();
    });
  }
}
