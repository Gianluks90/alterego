import { Component, OnInit } from '@angular/core';
import { ThemeService } from './theme.service';

@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss'
})
export class ThemeToggleComponent implements OnInit {
  theme: 'green' | 'cyan' | 'amber' = 'green';

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.theme = this.themeService.currentTheme;
    this.themeService.setTheme(this.theme);
  }

  toggleTheme() {
    if (this.theme === 'green') this.theme = 'cyan';
    else if (this.theme === 'cyan') this.theme = 'amber';
    else this.theme = 'green';
    this.themeService.setTheme(this.theme);
  }
}