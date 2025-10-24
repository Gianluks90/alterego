import { Component, OnInit } from '@angular/core';
import { ThemeService } from './theme.service';

@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss'
})
export class ThemeToggleComponent implements OnInit {
  theme: 'green' | 'ciano' | 'amber' = 'green';

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.theme = this.themeService.currentTheme;
    this.themeService.setTheme(this.theme);
  }

  toggleTheme() {
    if (this.theme === 'green') this.theme = 'ciano';
    else if (this.theme === 'ciano') this.theme = 'amber';
    else this.theme = 'green';
    this.themeService.setTheme(this.theme);
  }
}