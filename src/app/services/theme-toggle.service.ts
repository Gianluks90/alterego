import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'green' | 'cyan' | 'amber' | 'apple' | 'ibm';

@Injectable({
  providedIn: 'root'
})
export class ThemeToggleService {
  private themeSubject = new BehaviorSubject<Theme>(this.loadTheme());
  theme$ = this.themeSubject.asObservable();

  private loadTheme(): Theme {
    const saved = localStorage.getItem('theme');
    return (saved === 'cyan' || saved === 'amber' || saved === 'apple' || saved === 'ibm') ? saved : 'green';
  }

  setTheme(theme: Theme) {
    this.themeSubject.next(theme);
    localStorage.setItem('theme', theme);
    document.body.classList.remove('green-theme', 'cyan-theme', 'amber-theme', 'ibm-theme' ,'apple-theme', 'ibm-theme');
    document.body.classList.add(`${theme}-theme`);
  }

  get currentTheme(): Theme {
    return this.themeSubject.value;
  }
}
