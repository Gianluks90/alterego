import { Component, effect, HostListener, inject } from '@angular/core';
import { appVersion } from '../../../environment/appVersion';
import { AppUser } from '../../../models/appUser';
import { FirebaseService } from '../../services/firebase.service';
import { TermLine } from '../../../models/termLine';
import { Router, RouterLink } from '@angular/router';
import { getAuth } from 'firebase/auth';
import { appTitleLines } from '../../../environment/titleLines';
import { Dialog, DialogModule, DialogRef } from '@angular/cdk/dialog';
import { HelpDialogComponent } from '../../components/dialogs/help-dialog/help-dialog.component';
import { dialogsConfig, fullSizeDialog, smallSizeDialog } from '../../../environment/dialogsConfig';
import { AboutDialogComponent } from '../../components/dialogs/about-dialog/about-dialog.component';
import { NotificationService } from '../../services/notification.service';

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
  private dialogRef: DialogRef<any, any> | null = null;

  constructor(
    private firebaseService: FirebaseService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    effect(() => {
      this.user = this.firebaseService.$user();
      if (this.user) {
        this.notificationService.notify(`Welcome back, ${this.user.username}!`);
        this.appSubtitleLines.push({ text: `> ${this.user.username} logged in`, delay: 4000, class: 'subtitle-line' });
      }
    });
  }

  public appSubtitleLines: TermLine[] = [
    { text: `ALT OS (2025.10) v. ${appVersion}`, delay: 3200, class: 'subtitle-line' },
    { text: 'Boot completed ................................ [  OK  ]', delay: 3400, class: 'subtitle-line' },
    { text: 'UI components ready ........................... [  OK  ]', delay: 3600, class: 'subtitle-line' },
  ];

  public logOut(): void {
    getAuth().signOut().then(() => {
      window.location.reload();
    });
  }

  public windowSize: number = window.innerWidth;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.windowSize = event.target.innerWidth;
    this.dialogRef?.updateSize(this.windowSize <= 768 ? fullSizeDialog : smallSizeDialog);
  }

  public helpDialogOpen(): void {
    this.dialogRef = this.dialog.open(HelpDialogComponent, {
      width: this.windowSize <= 768 ? fullSizeDialog : smallSizeDialog,
      ...dialogsConfig
    });
  }

  public aboutDialogOpen(): void {
    this.dialogRef = this.dialog.open(AboutDialogComponent, {
      width: this.windowSize <= 768 ? fullSizeDialog : smallSizeDialog,
      ...dialogsConfig
    });
  }
}
