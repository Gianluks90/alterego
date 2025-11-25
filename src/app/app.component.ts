import { Component, HostListener, inject } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { ThemeToggleService } from './services/theme-toggle.service';
import { ThemeToggleButtonComponent } from './components/theme-toggle-button/theme-toggle-button.component';
import { FirebaseService } from './services/firebase.service';
import { UnsupportedPageComponent } from './views/unsupported-page/unsupported-page.component';
import { NotificationService } from './services/notification.service';
import { GlobalLoaderComponent } from './components/global-loader/global-loader.component';
import { SoundService } from './services/sound.service';
import { InspectorComponent } from './components/inspector/inspector.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, 
    ThemeToggleButtonComponent, 
    UnsupportedPageComponent, 
    GlobalLoaderComponent,
    InspectorComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  public isUnsupported: boolean = false;
  public loadingRoot: boolean = false;
  public soundService = inject(SoundService);

  constructor(
    private firebaseService: FirebaseService, // Used to initialize Firebase
    private notificationService: NotificationService, // Used to initialize Notification Service
    private themeService: ThemeToggleService,
    private router: Router
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.loadingRoot = true;
      }
      if (event instanceof NavigationEnd) {
        this.loadingRoot = false;
      }
    });
  } 

  ngOnInit() {
    this.themeService.setTheme(this.themeService.currentTheme);
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isUnsupported = window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent);
  }
}
