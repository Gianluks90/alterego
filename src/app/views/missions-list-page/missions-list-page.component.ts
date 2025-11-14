import { Component, effect, HostListener, inject } from '@angular/core';
import { APP_TITLE_LINES } from '../../const/titleLines';
import { Router, RouterLink } from '@angular/router';
import { MissionService } from '../../services/mission.service';
import { Mission } from '../../../models/mission';
import { FirebaseService } from '../../services/firebase.service';
import { TermLine } from '../../../models/termLine';
import { NewGameDialogComponent } from '../../components/dialogs/new-game-dialog/new-game-dialog.component';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { DIALOGS_CONFIG, FULL_SIZE_DIALOG, SMALL_SIZE_DIALOG } from '../../const/dialogsConfig';
import { UpperCasePipe } from '@angular/common';
import { JoinGameDialogComponent } from '../../components/dialogs/join-game-dialog/join-game-dialog.component';
import { NotificationService } from '../../services/notification.service';
import { AppUser } from '../../../models/appUser';
import { DialogResult } from '../../../models/dialogResult';
import { DeleteDialogComponent } from '../../components/dialogs/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-missions-list-page',
  imports: [RouterLink, UpperCasePipe],
  templateUrl: './missions-list-page.component.html',
  styleUrl: './missions-list-page.component.scss'
})
export class MissionsListPageComponent {
  public titleLines = APP_TITLE_LINES;
  public user: AppUser | null = null;
  public missions: Mission[] | null = null;
  private dialog = inject(Dialog);
  private dialogRef: DialogRef<DialogResult, any> | null = null;

  constructor(
    private missionService: MissionService,
    private firebaseService: FirebaseService,
    private notificationService: NotificationService,
    private router: Router
  ) {

    effect(() => {
      this.missions = this.missionService.$missions();
      if (this.missions && this.missions.length === 0) {
        setTimeout(() => {
          this.noMissionsLines.push({ text: `> No missions found. Create a new mission to get started!`, delay: 600, class: 'subtitle-line' });
        }, 2000);
      }
    })

    effect(() => {
      this.user = this.firebaseService.$user();
      if (this.user) {
        this.missionService.getMyMissions(this.user.uid);
      }
    });
  }

  public noMissionsLines: TermLine[] = [
    { text: 'Missions list view initialized...', delay: 200, class: 'subtitle-line' },
    { text: 'Fetching your missions from the server ..................... [  OK  ]', delay: 400, class: 'subtitle-line' },
  ];

  public windowSize: number = window.innerWidth;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.windowSize = event.target.innerWidth;
    this.dialogRef?.updateSize(this.windowSize <= 768 ? FULL_SIZE_DIALOG : SMALL_SIZE_DIALOG);
  }

  public openNewGameDialog(): void {
    this.dialogRef = this.dialog.open(NewGameDialogComponent, {
      width: this.windowSize <= 768 ? FULL_SIZE_DIALOG : SMALL_SIZE_DIALOG,
      ...DIALOGS_CONFIG,
    });

    this.dialogRef.closed.subscribe((result) => {
      if (result?.status === 'confirmed') {
        this.missionService.createNewMission(result.data, this.firebaseService.$user()!.uid).then(() => {
          this.notificationService.notify('Missione creata con successo!', 'check');
        }).catch((error) => {
          this.notificationService.notify('Errore durante la creazione della missione.', 'dangerous');
        });
      }
    });
  }

  public openJoinGameDialog(): void {
    this.dialogRef = this.dialog.open(JoinGameDialogComponent, {
      width: this.windowSize <= 768 ? FULL_SIZE_DIALOG : SMALL_SIZE_DIALOG,
      ...DIALOGS_CONFIG,
    });

    this.dialogRef.closed.subscribe((result) => {
      if (result?.status === 'confirmed') {
        this.missionService.joinMission(result.data.id, this.firebaseService.$user()!.uid).then(() => {
          this.notificationService.notify('Iscritto alla missione con successo!', 'check');
        }).catch((error) => {
          this.notificationService.notify('Errore durante l\'iscrizione alla missione.', 'dangerous');
        });
      }
    });
  }

  public openDeleteGameDialog(gameId: string): void {
    this.dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: this.windowSize <= 768 ? FULL_SIZE_DIALOG : SMALL_SIZE_DIALOG,
      ...DIALOGS_CONFIG,
      disableClose: true,
    });

    this.dialogRef.closed.subscribe((result) => {
      if (result?.status === 'confirmed') {
        this.missionService.deleteMission(gameId).then(() => {
          this.notificationService.notify('Missione eliminata con successo!', 'check');
        }).catch((error) => {
          this.notificationService.notify('Errore durante l\'eliminazione della missione.', 'dangerous');
        });
      }
      if (result?.status === 'cancelled') {
        this.notificationService.notify('Eliminazione della missione annullata.', 'info');
      }
    });
  }

  public nav(mission: Mission): void {
    switch (mission.status) {
      case 'waiting':
        this.router.navigate(['/missions', mission.id, 'lobby'], { state: { missionId: mission.id } });
        break;

      case 'in_progress':
        this.router.navigate(['/missions', mission.id, 'play']);
        break;

      case 'finished':
        break;
    }
  }
}