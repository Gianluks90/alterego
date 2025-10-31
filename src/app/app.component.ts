import { Component, HostListener } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ThemeToggleService } from './services/theme-toggle.service';
import { ThemeToggleButtonComponent } from './components/theme-toggle-button/theme-toggle-button.component';
import { FirebaseService } from './services/firebase.service';
import { UnsupportedPageComponent } from './views/unsupported-page/unsupported-page.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ThemeToggleButtonComponent, UnsupportedPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'alterego';
  public isUnsupported = false;

  constructor(
    private firebaseService: FirebaseService,
    private themeService: ThemeToggleService,
    private router: Router
  ) { } 

  ngOnInit() {
    this.themeService.setTheme(this.themeService.currentTheme);
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isUnsupported = window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent);
  }
}
