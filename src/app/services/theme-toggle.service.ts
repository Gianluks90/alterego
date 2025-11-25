import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'green' | 'cyan' | 'amber' | 'apple' | 'cyberpunk' | 'ibm';

@Injectable({
  providedIn: 'root'
})
export class ThemeToggleService {
  private themeSubject = new BehaviorSubject<Theme>(this.loadTheme());
  theme$ = this.themeSubject.asObservable();

  private loadTheme(): Theme {
    const saved = localStorage.getItem('theme');
    return (saved === 'cyan' || saved === 'amber' || saved === 'apple' || saved === 'cyberpunk' || saved === 'ibm') ? saved : 'green';
  }

  setTheme(theme: Theme) {
    this.themeSubject.next(theme);
    localStorage.setItem('theme', theme);
    document.body.classList.remove('green-theme', 'cyan-theme', 'amber-theme', 'ibm-theme' ,'apple-theme', 'cyberpunk-theme', 'ibm-theme');
    document.body.classList.add(`${theme}-theme`);
  }

  get currentTheme(): Theme {
    return this.themeSubject.value;
  }

  get curremtThemeColor(): string {
    switch (this.currentTheme) {
      case 'green': return '#00ff41';
      case 'cyan': return '#00ffff';
      case 'amber': return '#ffaa00';
      case 'apple': return '#ffffff';
      case 'cyberpunk': return '#BF5B56';
      case 'ibm': return '#00ff41';
      default: return '#00ff41';
    }
  }
}
