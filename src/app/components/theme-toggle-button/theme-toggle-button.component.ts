import { Component } from '@angular/core';
import { ThemeToggleService } from '../../services/theme-toggle.service';

@Component({
  selector: 'app-theme-toggle-button',
  imports: [],
  templateUrl: './theme-toggle-button.component.html',
  styleUrl: './theme-toggle-button.component.scss'
})
export class ThemeToggleButtonComponent {
  theme: 'green' | 'cyan' | 'amber' | 'apple' | 'ibm' = 'green';

  constructor(private themeService: ThemeToggleService) { }

  ngOnInit() {
    this.theme = this.themeService.currentTheme;
    this.themeService.setTheme(this.theme);
  }

  toggleTheme() {
    const themes: ('green' | 'cyan' | 'amber' | 'apple' | 'ibm')[] = ['green', 'cyan', 'amber', 'apple', 'ibm'];
    const currentIndex = themes.indexOf(this.theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    this.theme = themes[nextIndex];
    this.themeService.setTheme(this.theme);
  }
}
