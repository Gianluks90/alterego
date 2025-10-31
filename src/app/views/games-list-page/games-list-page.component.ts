import { Component, effect, HostListener, inject } from '@angular/core';
import { appTitleLines } from '../../../environment/titleLines';
import { Router, RouterLink } from '@angular/router';
import { GamesService } from '../../services/games.service';
import { Game } from '../../../models/game';
import { FirebaseService } from '../../services/firebase.service';
import { TermLine } from '../../../models/termLine';
import { NewGameDialogComponent } from '../../components/dialogs/new-game-dialog/new-game-dialog.component';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { dialogsConfig, fullSizeDialog, smallSizeDialog } from '../../../environment/dialogsConfig';
import { UpperCasePipe } from '@angular/common';
import { JoinGameDialogComponent } from '../../components/dialogs/join-game-dialog/join-game-dialog.component';
import { NotificationService } from '../../services/notification.service';
import { AppUser } from '../../../models/appUser';
import { DialogResult } from '../../../models/dialogResult';
import { DeleteDialogComponent } from '../../components/dialogs/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-games-list-page',
  imports: [RouterLink, UpperCasePipe],
  templateUrl: './games-list-page.component.html',
  styleUrl: './games-list-page.component.scss'
})
export class GamesListPageComponent {
  public titleLines = appTitleLines;
  public user: AppUser | null = null;
  public games: Game[] | null = null;
  private dialog = inject(Dialog);
  private dialogRef: DialogRef<DialogResult, any> | null = null;

  constructor(
    private gamesService: GamesService,
    private firebaseService: FirebaseService,
    private notificationService: NotificationService,
    private router: Router
  ) {

    effect(() => {
      this.games = this.gamesService.$games();
      if (this.games && this.games.length === 0) {
        setTimeout(() => {
          this.noGamesLines.push({ text: `> No games found. Create a new game to get started!`, delay: 600, class: 'subtitle-line' });
        }, 2000);
      }
    })

    effect(() => {
      this.user = this.firebaseService.$user();
      if (this.user) {
        this.gamesService.getMyGames(this.user.uid);
      }
    });
  }

  public noGamesLines: TermLine[] = [
    { text: 'Games list view initialized...', delay: 200, class: 'subtitle-line' },
    { text: 'Fetching your games from the server ..................... [  OK  ]', delay: 400, class: 'subtitle-line' },
  ];

  public windowSize: number = window.innerWidth;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.windowSize = event.target.innerWidth;
    this.dialogRef?.updateSize(this.windowSize <= 768 ? fullSizeDialog : smallSizeDialog);
  }

  public openNewGameDialog(): void {
    this.dialogRef = this.dialog.open(NewGameDialogComponent, {
      width: this.windowSize <= 768 ? fullSizeDialog : smallSizeDialog,
      ...dialogsConfig,
    });

    this.dialogRef.closed.subscribe((result) => {
      if (result?.status === 'confirmed') {
        this.gamesService.createNewGame(result.data, this.firebaseService.$user()!.uid).then(() => {
          this.notificationService.notify('Game created successfully!', 'check');
        }).catch((error) => {
          this.notificationService.notify('Error creating game.', 'dangerous');
        });
      }
    });
  }

  public openJoinGameDialog(): void {
    this.dialogRef = this.dialog.open(JoinGameDialogComponent, {
      width: this.windowSize <= 768 ? fullSizeDialog : smallSizeDialog,
      ...dialogsConfig,
    });

    this.dialogRef.closed.subscribe((result) => {
      if (result?.status === 'confirmed') {
        this.gamesService.joinGame(result.data, this.firebaseService.$user()!.uid).then(() => {
          this.notificationService.notify('Joined game successfully!', 'check');
        }).catch((error) => {
          this.notificationService.notify('Error joining game.', 'dangerous');
        });
      }
    });
  }

  public openDeleteGameDialog(gameId: string): void {
    this.dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: this.windowSize <= 768 ? fullSizeDialog : smallSizeDialog,
      ...dialogsConfig,
      disableClose: true,
    });

    this.dialogRef.closed.subscribe((result) => {
      if (result?.status === 'confirmed') {
        this.gamesService.deleteGame(gameId).then(() => {
          this.notificationService.notify('Game deleted successfully!', 'check');
        }).catch((error) => {
          this.notificationService.notify('Error deleting game.', 'dangerous');
        });
      }
      if (result?.status === 'cancelled') {
        this.notificationService.notify('Game deletion cancelled.', 'info');
      }
    });
  }

  public nav(game: Game): void {
    switch (game.status) {
      case 'waiting':
        this.router.navigate(['/games', game.id, 'lobby']);
        break;

      case 'in_progress':
        this.router.navigate(['/games', game.id, 'play']);
        break;

      case 'finished':
        break;
    }
  }
}