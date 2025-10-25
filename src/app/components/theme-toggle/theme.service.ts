import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'green' | 'cyan' | 'amber' | 'ibm';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private themeSubject = new BehaviorSubject<Theme>(this.loadTheme());
  theme$ = this.themeSubject.asObservable();

  private loadTheme(): Theme {
    const saved = localStorage.getItem('theme');
    return (saved === 'cyan' || saved === 'amber' || saved === 'ibm') ? saved : 'green';
  }

  setTheme(theme: Theme) {
    this.themeSubject.next(theme);
    localStorage.setItem('theme', theme);
    document.body.setAttribute('data-theme', theme);
    document.body.style.setProperty('--fg-color', `var(--fg-${theme}-color)`);
    document.documentElement.style.setProperty('--fg-color', `var(--fg-${theme}-color)`);
    document.body.style.setProperty('color', `var(--fg-${theme}-color)`);
    if (theme === 'ibm') {
      document.body.style.setProperty('background-color', 'var(--bg-ibm-color)');
    } else {
      document.body.style.setProperty('background-color', 'var(--bg-main-color)');
    }
  }
  
  get currentTheme(): Theme {
    return this.themeSubject.value;
  }
}