import { Component, effect, input, signal } from '@angular/core';

@Component({
  selector: 'app-tab-menu-container',
  imports: [],
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
