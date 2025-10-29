import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeToggleService } from './services/theme-toggle.service';
import { ThemeToggleButtonComponent } from './components/theme-toggle-button/theme-toggle-button.component';
import { FirebaseService } from './services/firebase.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ThemeToggleButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'alterego';

  constructor(
    private firebaseService: FirebaseService,
    private themeService: ThemeToggleService
  ) { } 

  ngOnInit() {
    this.themeService.setTheme(this.themeService.currentTheme);
  }
}
