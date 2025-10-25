import { Injectable } from '@angular/core';
import { Theme, ThemeService } from '../components/theme-toggle/theme.service';
import { NotificationService } from './notification.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CommandService {
  constructor(private themeService: ThemeService, private notify: NotificationService, private router: Router) { }

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
      
      case '/nav':
        this.handleNavigateCommand(arg);
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

private handleNavigateCommand(arg?: string) {
  if (!arg) {
    this.notify.show('Usage: /nav [path]', 'info');
    return;
  }

  if (arg === 'back') {
    window.history.back();
    return;
  }

  if (arg === 'home') {
    this.router.navigateByUrl('/').catch(() => {
      this.notify.show('Failed to navigate to home.', 'warning');
    });
    return;
  }

  // naviga qualunque path; se non esiste, Angular mostrerà NotFoundComponent
  this.router.navigateByUrl(arg).catch(() => {
    this.notify.show(`Failed to navigate to: ${arg}`, 'warning');
  });
}
}
