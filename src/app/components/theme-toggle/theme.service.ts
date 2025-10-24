import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

type Theme = 'green' | 'ciano' | 'amber';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private themeSubject = new BehaviorSubject<Theme>(this.loadTheme());
  theme$ = this.themeSubject.asObservable();

  private loadTheme(): Theme {
    const saved = localStorage.getItem('theme');
    return (saved === 'ciano' || saved === 'amber') ? saved : 'green';
  }

  setTheme(theme: Theme) {
    this.themeSubject.next(theme);
    localStorage.setItem('theme', theme);
    document.body.setAttribute('data-theme', theme);
    document.body.style.setProperty('--fg-color', `var(--fg-${theme}-color)`);
    document.body.style.setProperty('color', `var(--fg-${theme}-color)`);
  }
  

  get currentTheme(): Theme {
    return this.themeSubject.value;
  }
}