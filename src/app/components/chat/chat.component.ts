import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { DatePipe } from '@angular/common';
import { Component, computed, effect, HostListener, inject, input } from '@angular/core';
import { DialogResult } from '../../../models/dialogResult';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MissionService } from '../../services/mission.service';
import { Timestamp } from 'firebase/firestore';
import { Player } from '../../../models/player';
import { Mission } from '../../../models/mission';
import { ChatHelpDialogComponent } from '../dialogs/chat-help-dialog/chat-help-dialog.component';
import { DIALOGS_CONFIG, FULL_SIZE_DIALOG, SMALL_SIZE_DIALOG } from '../../const/dialogsConfig';
import { DeleteDialogComponent } from '../dialogs/delete-dialog/delete-dialog.component';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-chat',
  imports: [DatePipe, FormsModule, ReactiveFormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {

  public $player = input<Player | null>(null);
  public $mission = input<Mission | null>(null);

  public player: Player | null = null;
  public mission: Mission | null = null;
  
  public $$chatState = computed(() => {
    const mission = this.$mission();
    const player = this.$player();

    return {
      mission,
      player,
      ready: !!mission && !!player
    };
  })

  private dialog = inject(Dialog);
  private dialogRef: DialogRef<DialogResult, any> | null = null;

  public chatForm: FormGroup = new FormGroup({
    message: new FormControl('', [Validators.required, Validators.minLength(1)]),
    timestamp: new FormControl(null),
    senderPlayer: new FormControl(''),
    class: new FormControl('')
  });

  public windowSize: number = window.innerWidth;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.windowSize = event.target.innerWidth;
    this.dialogRef?.updateSize(this.windowSize <= 768 ? FULL_SIZE_DIALOG : SMALL_SIZE_DIALOG);
  }

  constructor(
    private missionService: MissionService,
    private notificationService: NotificationService
  ) {

    effect(() => {
      if (this.$$chatState().ready) {
        this.mission = this.$$chatState().mission;
        this.player = this.$$chatState().player;
      }
    }); }

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

    if (commandHandlers[lowerCommand]) {
      const { message, class: cssClass } = commandHandlers[lowerCommand](args.join(' '));
      formattedMessage = message;
      messageClass = cssClass ?? '';
    }

    const newLog = {
      timestamp: Timestamp.now(),
      senderPlayer: `Agent_${this.$player()?.order}`,
      message: formattedMessage,
      class: messageClass
    };

    this.missionService.newChatLog(newLog, this.$mission()?.id!).then(() => {
      this.chatForm.reset();
    });
  }

  public openChatHelpDialog(): void {
    this.dialogRef = this.dialog.open(ChatHelpDialogComponent, {
      width: this.windowSize <= 768 ? FULL_SIZE_DIALOG : SMALL_SIZE_DIALOG,
      ...DIALOGS_CONFIG
    });
  }

  public openDeleteLogsDialog(): void {
    this.dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: this.windowSize <= 768 ? FULL_SIZE_DIALOG : SMALL_SIZE_DIALOG,
      ...DIALOGS_CONFIG,
      disableClose: true,
    });

    this.dialogRef.closed.subscribe((result) => {
      if (result?.status === 'confirmed') {
        this.missionService.emptyChatLogs(this.$mission()?.id!).then(() => {
          this.notificationService.notify('Chat logs deleted successfully!', 'check');
        });
      }
    });
  }
}
