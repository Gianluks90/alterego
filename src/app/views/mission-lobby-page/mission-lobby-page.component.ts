import { Component, effect, HostListener, inject } from '@angular/core';
import { appTitleLines } from '../../../environment/titleLines';
import { RouterLink } from '@angular/router';
import { Mission } from '../../../models/mission';
import { MissionService } from '../../services/mission.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Timestamp } from 'firebase/firestore';
import { FirebaseService } from '../../services/firebase.service';
import { DatePipe } from '@angular/common';
import { Player } from '../../../models/player';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { DialogResult } from '../../../models/dialogResult';
import { dialogsConfig, fullSizeDialog, smallSizeDialog } from '../../../environment/dialogsConfig';
import { DeleteDialogComponent } from '../../components/dialogs/delete-dialog/delete-dialog.component';
import { NotificationService } from '../../services/notification.service';
import { ChatHelpDialogComponent } from '../../components/dialogs/chat-help-dialog/chat-help-dialog.component';

@Component({
  selector: 'app-mission-lobby-page',
  imports: [RouterLink, FormsModule, ReactiveFormsModule, DatePipe],
  templateUrl: './mission-lobby-page.component.html',
  styleUrl: './mission-lobby-page.component.scss'
})
export class MissionLobbyPageComponent {
  public titleLines = appTitleLines;
  public missionId: string | null = null;
  public mission: Mission | null = null;
  public player: Player | null = null;
  private dialog = inject(Dialog);
  private dialogRef: DialogRef<DialogResult, any> | null = null;

  public windowSize: number = window.innerWidth;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.windowSize = event.target.innerWidth;
    this.dialogRef?.updateSize(this.windowSize <= 768 ? fullSizeDialog : smallSizeDialog);
  }

  public chatForm: FormGroup = new FormGroup({
    message: new FormControl('', [Validators.required, Validators.minLength(1)]),
    timestamp: new FormControl(null),
    senderPlayer: new FormControl(''),
    class: new FormControl('')
  });

  constructor(
    private firebaseService: FirebaseService,
    private missionService: MissionService,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {
    const navigation = history.state;
    if (navigation && navigation.missionId) {
      this.missionId = navigation.missionId;
    }

    effect(() => {
      if (this.missionId) {
        this.missionService.getMissionById(this.missionId);
      }
    });

    effect(() => {
      this.mission = this.missionService.$selectedMission();
    });

    effect(() => {
      if (this.firebaseService.$user()) {
        this.mission?.playersData.find(playerData => {
          if (playerData.uid === this.firebaseService.$user()!.uid) {
            this.player = {
              ...playerData,
              order: this.mission?.players.indexOf(playerData.uid) ?? -1
            }
          }
        });
      }
    });
  }

  // AGENT SETUP

  // CHAT LOG

  // public sendMessage(): void {
  //   if (!this.player) return;

  //   const commands: string[] = ['/shout'];
  //   if (commands.includes(this.chatForm.value.message.trim().toLowerCase())) {
  //     this.chatForm.patchValue({
  //       class: 'shout-message'
  //     });
  //   }

  //   this.chatForm.patchValue({
  //     timestamp: Timestamp.now(),
  //     senderPlayer: 'Agent_' + (this.player?.order + 1),
  //     message: this.chatForm.get('class')?.value !== '' ? this.chatForm.get('message')?.value.split(' ')[1] : this.chatForm.value.message
  //   });

  //   this.missionService.newChatLog(this.chatForm.value, this.missionId!).then(() => {
  //     this.chatForm.reset();
  //     this.chatForm.patchValue({
  //       senderPlayer: 'Agent_' + this.player?.order + 1,
  //       timestamp: Timestamp.now()
  //     });
  //   });
  // }

  public sendMessage(): void {
    if (!this.player || this.chatForm.invalid) return;

    const rawMessage = this.chatForm.value.message.trim();
    const [command, ...args] = rawMessage.split(' ');
    const lowerCommand = command.toLowerCase();

    // Registro dei comandi speciali
    const commandHandlers: Record<string, (msg: string) => { message: string; class?: string }> = {
      '/shout': (msg) => ({
        message: msg.toUpperCase(),
        class: 'shout-message'
      }),
      // aggiungerai altri qui, tipo /roll, /whisper, ecc.
    };

    let formattedMessage = rawMessage;
    let messageClass = '';

    // Se è un comando riconosciuto
    if (commandHandlers[lowerCommand]) {
      const { message, class: cssClass } = commandHandlers[lowerCommand](args.join(' '));
      formattedMessage = message;
      messageClass = cssClass ?? '';
    }

    const newLog = {
      timestamp: Timestamp.now(),
      senderPlayer: `Agent_${this.player.order + 1}`,
      message: formattedMessage,
      class: messageClass
    };

    this.missionService.newChatLog(newLog, this.missionId!).then(() => {
      this.chatForm.reset();
    });
  }

  public openChatHelpDialog(): void {
    this.dialogRef = this.dialog.open(ChatHelpDialogComponent, {
      width: this.windowSize <= 768 ? fullSizeDialog : smallSizeDialog,
      ...dialogsConfig
    });
  }

  public openDeleteLogsDialog(): void {
    this.dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: this.windowSize <= 768 ? fullSizeDialog : smallSizeDialog,
      ...dialogsConfig,
      disableClose: true,
    });

    this.dialogRef.closed.subscribe((result) => {
      if (result?.status === 'confirmed') {
        this.missionService.emptyChatLogs(this.missionId!).then(() => {
          this.notificationService.notify('Chat logs deleted successfully!', 'check');
        });
      }
    });
  }
}
