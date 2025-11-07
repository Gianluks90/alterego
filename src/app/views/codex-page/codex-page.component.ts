import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { APP_TITLE_LINES } from '../../../environment/titleLines';
import { TabMenuContainerComponent } from '../../components/tab-menu-container/tab-menu-container.component';
import { UI_SOUNDS_DIRECTIVES } from '../../../environment/uiSounds';

@Component({
  selector: 'app-codex-page',
  imports: [RouterLink, TabMenuContainerComponent, UI_SOUNDS_DIRECTIVES],
  templateUrl: './codex-page.component.html',
  styleUrl: './codex-page.component.scss'
})
export class CodexPageComponent {
  public titleLines = APP_TITLE_LINES;
  public resolvedData: any;

  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe((data) => {
      this.resolvedData = data['resolved'];
    });
  }

}
