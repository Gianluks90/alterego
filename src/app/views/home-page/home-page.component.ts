import { Component, effect } from '@angular/core';
import { appVersion } from '../../../environment/appVersion';
import { AppUser } from '../../../models/appUser';
import { FirebaseService } from '../../services/firebase.service';
import { TermLine } from '../../../models/termLine';
import { Router, RouterLink } from '@angular/router';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {

  public user: AppUser | null = null;

  constructor(
    private firebaseService: FirebaseService,
    private router: Router
  ) {
    effect(() => {
      this.user = this.firebaseService.$user();
      if (this.user) {
        this.appSubtitleLines.push({ text: `> ${this.user.username} logged in`, delay: 2500, class: 'subtitle-line' });
      }
    });
  }

  public appTitleLines: TermLine[] = [
    { text: ' █████╗ ██╗  ████████╗███████╗██████╗ ███████╗ ██████╗  ██████╗ ', delay: 400, class: 'title-line' },
    { text: '██╔══██╗██║  ╚══██╔══╝██╔════╝██╔══██╗██╔════╝██╔════╝ ██╔═══██╗', delay: 600, class: 'title-line' },
    { text: '███████║██║     ██║   █████╗  ██████╔╝█████╗  ██║  ███╗██║   ██║', delay: 800, class: 'title-line' },
    { text: '██╔══██║██║     ██║   ██╔══╝  ██╔══██╗██╔══╝  ██║   ██║██║   ██║', delay: 1000, class: 'title-line' },
    { text: '██║  ██║███████╗██║   ███████╗██║  ██║███████╗╚██████╔╝╚██████╔╝', delay: 1200, class: 'title-line' },
    { text: '╚═╝  ╚═╝╚══════╝╚═╝   ╚══════╝╚═╝  ╚═╝╚══════╝ ╚═════╝  ╚═════╝ ', delay: 1400, class: 'title-line' },
  ];

  public appSubtitleLines: TermLine[] = [
    { text: `ALT OS (2025.10) v. ${appVersion}`, delay: 1800, class: 'subtitle-line' },
    { text: 'Boot completed ................................ [  OK  ]', delay: 2000, class: 'subtitle-line' },
    { text: 'UI components ready ........................... [  OK  ]', delay: 2200, class: 'subtitle-line' },
  ];

  public logOut(): void {
    getAuth().signOut().then(() => {
      window.location.reload();
    });
  }
}
