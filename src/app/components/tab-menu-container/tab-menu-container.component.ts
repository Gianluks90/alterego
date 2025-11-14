import { Component, effect, input, signal } from '@angular/core';
import { UI_SOUNDS_DIRECTIVES } from '../../const/uiSounds';

@Component({
  selector: 'app-tab-menu-container',
  imports: [UI_SOUNDS_DIRECTIVES],
  templateUrl: './tab-menu-container.component.html',
  styleUrl: './tab-menu-container.component.scss',
  exportAs: 'tabMenu'
})
export class TabMenuContainerComponent {
  public $tabs = input<string[]>();
  public $selectedTab = signal<string>('');

  get selectedTab() {
    return this.$selectedTab();
  }

  constructor() {
    effect(() => {
      const tabs = this.$tabs();
      if (tabs && tabs.length > 0) {
        this.$selectedTab.set(tabs[0]);
      }
    });
  }
}
