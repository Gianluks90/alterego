import { Component } from '@angular/core';
import { ThemeToggleService } from '../../services/theme-toggle.service';
import { CdkMenuTrigger, CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import { ConnectedPosition } from '@angular/cdk/overlay';

@Component({
  selector: 'app-theme-toggle-button',
  imports: [
    CdkMenuTrigger,
    CdkMenu,
    CdkMenuItem,
  ],
  templateUrl: './theme-toggle-button.component.html',
  styleUrl: './theme-toggle-button.component.scss'
})
export class ThemeToggleButtonComponent {
  theme: 'green' | 'cyan' | 'amber' | 'apple' | 'cyberpunk' | 'ibm' = 'green';
  public themes = [
    { name: 'Green', value: 'green' },
    { name: 'Cyan', value: 'cyan' },
    { name: 'Amber', value: 'amber' },
    { name: 'Apple', value: 'apple' },
    { name: 'Cyberpunk', value: 'cyberpunk' },
    { name: 'IBM', value: 'ibm' }
  ]

  constructor(private themeService: ThemeToggleService) { }

  ngOnInit() {
    this.theme = this.themeService.currentTheme;
    this.themeService.setTheme(this.theme);
  }

  selectTheme(theme: string) {
    this.theme = theme as 'green' | 'cyan' | 'amber' | 'apple' | 'cyberpunk' | 'ibm';
    this.themeService.setTheme(this.theme);
  }

  toggleTheme() {
    const themes: ('green' | 'cyan' | 'amber' | 'apple' | 'cyberpunk' | 'ibm')[] = ['green', 'cyan', 'amber', 'apple', 'cyberpunk', 'ibm'];
    const currentIndex = themes.indexOf(this.theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    this.theme = themes[nextIndex];
    this.themeService.setTheme(this.theme);
  }
}
