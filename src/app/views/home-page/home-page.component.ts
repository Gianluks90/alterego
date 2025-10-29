import { Component, effect, inject } from '@angular/core';
import { appVersion } from '../../../environment/appVersion';
import { AppUser } from '../../../models/appUser';
import { FirebaseService } from '../../services/firebase.service';
import { TermLine } from '../../../models/termLine';
import { Router, RouterLink } from '@angular/router';
import { getAuth } from 'firebase/auth';
import { appTitleLines } from '../../../environment/titleLines';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { HelpDialogComponent } from '../../components/dialogs/help-dialog/help-dialog.component';
import { dialogsConfig, largeSizeDialog } from '../../../environment/dialogsConfig';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, DialogModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {

  public user: AppUser | null = null;
  public appTitleLines: TermLine[] = appTitleLines;
  private dialog = inject(Dialog);

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

  public helpDialogOpen(): void {
    const dialogRef = this.dialog.open(HelpDialogComponent, {
      width: largeSizeDialog,
      ...dialogsConfig
    });
  }
}
