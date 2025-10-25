import { Injectable } from '@angular/core';
import { Theme, ThemeService } from '../components/theme-toggle/theme.service';

@Injectable({
  providedIn: 'root'
})
export class CommandService {
  constructor(private themeService: ThemeService) { }

public execute(rawCommand: string): void {
  const parts = rawCommand.trim().toLowerCase().split(/\s+/);
  const command = parts[0];
  const arg = parts[1]?.trim();

  console.log(command, arg);
  

  switch (command) {
    case '/theme':
      this.handleThemeCommand(arg);
      break;

    default:
      console.warn(`Unknown command: ${rawCommand}`);
  }
}

  private handleThemeCommand(arg?: string) {
    const themes: Theme[] = ['green', 'cyan', 'amber'];
    const current = this.themeService.currentTheme;
    
    if (!arg) {
      const nextIndex = (themes.indexOf(current) + 1) % themes.length;
      this.themeService.setTheme(themes[nextIndex]);
    } else if (themes.includes(arg as Theme)) {
      this.themeService.setTheme(arg as Theme);
    } else {
      console.warn(`Unknown theme: ${arg}`);
    }
  }
}
