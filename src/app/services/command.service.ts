import { Injectable } from '@angular/core';
import { Theme, ThemeService } from '../components/theme-toggle/theme.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class CommandService {
  constructor(private themeService: ThemeService, private notify: NotificationService) { }

  public execute(rawCommand: string): void {
    const parts = rawCommand.trim().toLowerCase().split(/\s+/);
    const command = parts[0];
    const arg = parts[1]?.trim();

    switch (command) {
      case '/theme':
        this.handleThemeCommand(arg);
        break;

      case '/clear-history':
      case '/purge':
        localStorage.removeItem('terminalHistory');
        this.notify.show('[PURGE] Command history deleted from local memory.', 'check');
        break;

      default:
        this.notify.show(`Unknown command: ${command}`, 'warning');
    }
  }

  // Methods

  private handleThemeCommand(arg?: string) {
    const themes: Theme[] = ['green', 'cyan', 'amber', 'ibm'];
    const current = this.themeService.currentTheme;

    if (!arg) {
      const nextIndex = (themes.indexOf(current) + 1) % themes.length;
      this.themeService.setTheme(themes[nextIndex]);
    } else if (themes.includes(arg as Theme)) {
      this.themeService.setTheme(arg as Theme);
    } else {
      this.notify.show(`Invalid theme: ${arg}`, 'warning');
    }
  }
}
