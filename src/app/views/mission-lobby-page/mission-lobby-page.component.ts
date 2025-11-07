import { Component, effect, HostListener, inject } from '@angular/core';
import { APP_TITLE_LINES } from '../../../environment/titleLines';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Mission } from '../../../models/mission';
import { MissionService } from '../../services/mission.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Timestamp } from 'firebase/firestore';
import { FirebaseService } from '../../services/firebase.service';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { Archetype, Player } from '../../../models/player';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { DialogResult } from '../../../models/dialogResult';
import { DIALOGS_CONFIG, FULL_SIZE_DIALOG, SMALL_SIZE_DIALOG } from '../../../environment/dialogsConfig';
import { DeleteDialogComponent } from '../../components/dialogs/delete-dialog/delete-dialog.component';
import { NotificationService } from '../../services/notification.service';
import { ChatHelpDialogComponent } from '../../components/dialogs/chat-help-dialog/chat-help-dialog.component';
import { ARCHETYPES_DICT_ICONS, ROLES } from '../../../environment/roles';
import { ReplaceDashPipe } from '../../pipes/replace-dash.pipe';
import { AgentLabelPipe } from '../../pipes/agent-label.pipe';
import { AgentTagComponent } from '../../components/agent-tag/agent-tag.component';
import { ConfirmDialogComponent } from '../../components/dialogs/confirm-dialog/confirm-dialog.component';
import { AssignedOrderDialogComponent } from '../../components/dialogs/assigned-order-dialog/assigned-order-dialog.component';
import { CdkMenuTrigger, CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import { ConnectedPosition } from '@angular/cdk/overlay';
import { HelpLobbyDialogComponent } from '../../components/dialogs/help-lobby-dialog/help-lobby-dialog.component';
import { ChatComponent } from '../../components/chat/chat.component';

@Component({
  selector: 'app-mission-lobby-page',
  imports: [
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    AgentTagComponent,
    ChatComponent,
    UpperCasePipe,
    ReplaceDashPipe,
    AgentLabelPipe,
    CdkMenuTrigger,
    CdkMenu,
    CdkMenuItem
  ],
  templateUrl: './mission-lobby-page.component.html',
  styleUrl: './mission-lobby-page.component.scss'
})
export class MissionLobbyPageComponent {
  public titleLines = APP_TITLE_LINES;
  private dialog = inject(Dialog);
  private dialogRef: DialogRef<DialogResult, any> | null = null;
  private resolvedData: any;

  public missionId: string | null = null;
  public mission: Mission | null = null;

  public player: Player | null = null;
  public companies: any[] = [];
  public archetypesIcons: { [key: string]: string } = ARCHETYPES_DICT_ICONS;
  private allRoles = ROLES;
  public roles: string[] = [];

  private readonly LS_KEY = (uid: string) => `archetypes_${uid}`;
  public randomArchetypes: Archetype[] = [];

  public form: FormGroup = new FormGroup({
    company: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required]),
    archetype: new FormControl('', [Validators.required]),
    role: new FormControl('', [Validators.required])
  });

  public centeredMenuPos: ConnectedPosition[] = [
    {
      originX: 'center',
      originY: 'center',
      overlayX: 'center',
      overlayY: 'center',
    }
  ];

  public yourTurn: boolean = false;

  public windowSize: number = window.innerWidth;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.windowSize = event.target.innerWidth;
    this.dialogRef?.updateSize(this.windowSize <= 768 ? FULL_SIZE_DIALOG : SMALL_SIZE_DIALOG);
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
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {

    this.route.data.subscribe((data) => {
      this.resolvedData = data['resolved'];
      console.log(this.resolvedData);
      
    });

    const navigation = history.state;
    if (navigation && navigation.missionId) {
      this.missionId = navigation.missionId;
    }

    effect(() => {
      const user = this.firebaseService.$user();
      if (user && this.missionId) {
        this.missionService.getPlayerData(this.missionId, user.uid);
      }
    })

    effect(() => {
      const { mission, player, ready } = this.missionService.$$lobbyState();

      if (!ready) return;

      this.player = player;
      this.mission = mission;

      if (!player.order) {
        this.initOrder();
        return;
      }

      this.checkYourTurn();

      if (this.player?.status === 'ready') {
        this.form.patchValue({
          ...this.player
        })
      }
    });
  }

  ngOnInit(): void {
    // Carico la missione
    this.missionService.getMissionById(this.missionId!);

    // Carico i tutti ruoli
    const ROLES = import('../../../environment/roles').then(module => {
      this.allRoles = module.ROLES;
    });

    this.companies = this.resolvedData.companies;

    // Carico le companies
    // fetch('../../../configs/companiesConfig.json')
    //   .then(response => response.json())
    //   .then((companies: { name: string, label: string, description: string }[]) => {
    //     this.companies = companies.map(company => company.name);
    //   });
  }

  // AGENT SETUP

  private initOrder(): void {
    if (!this.mission || !this.player) return;

    const assignedOrders = new Set(
      this.mission.playersData
        .map(p => p.order)
        .filter(o => typeof o === 'number')
    );

    const availableOrders = [];
    for (let i = 1; i <= this.mission.playersLimit; i++) {
      if (!assignedOrders.has(i)) availableOrders.push(i);
    }

    if (!availableOrders.length) return;

    const randomOrder = availableOrders[Math.floor(Math.random() * availableOrders.length)];

    this.missionService.assignPlayerOrder(this.missionId!, this.player.uid, randomOrder).then(() => {
      const dialogRef = this.dialog.open(AssignedOrderDialogComponent, {
        width: this.windowSize <= 768 ? FULL_SIZE_DIALOG : SMALL_SIZE_DIALOG,
        ...DIALOGS_CONFIG,
        data: { order: randomOrder }
      });
    })
  }

  private checkYourTurn(): void {
    if (!this.mission || !this.player) return;

    const pendingPlayers = this.mission.playersData
      .filter(p => p.status !== 'ready')
      .sort((a, b) => a.order - b.order);

    const currentTurn = pendingPlayers[0];
    if (!currentTurn) {
      this.yourTurn = false;
      return;
    }

    this.yourTurn = currentTurn.uid === this.player.uid;

    if (this.yourTurn && this.player.status === 'pending') {
      this.missionService.updatePlayerStatus(this.missionId!, this.player.uid, 'setup').then(() => {
        this.notificationService.notify('It is your turn to set up your agent!', 'info', 5000);
        this.initArchetypesSelection();
      });
    }

    if (this.yourTurn && this.player.status === 'setup') {
      this.initArchetypesSelection();
    }
  }

  private initArchetypesSelection(): void {
    if (!this.mission || !this.player) return;

    if (this.player?.archetype) {
      this.randomArchetypes = [];
      return;
    }

    const saved = localStorage.getItem(this.LS_KEY(this.player!.uid));
    if (saved) {
      this.randomArchetypes = JSON.parse(saved) as Archetype[];
    } else {
      this.drawRandomArchetypes();
    }
  }

  private async drawRandomArchetypes(): Promise<void> {
    if (!this.mission?.archetypeIds || this.mission.archetypeIds.length === 0) return;
    const available = [...this.mission.archetypeIds];
    const first = this.pickRandom(available);
    let second = this.pickRandom(available);

    while (second === first && available.length > 1) {
      second = this.pickRandom(available);
    }

    // await fetch('../../../configs/archetypesConfig.json')
    //   .then(response => response.json())
    //   .then((archetypes: Archetype[]) => {
    //     this.randomArchetypes = archetypes.filter(a => a.id === first || a.id === second);
    //     localStorage.setItem(this.LS_KEY(this.player!.uid), JSON.stringify(this.randomArchetypes));
    //   })

    this.randomArchetypes = (this.resolvedData.archetypes as Archetype[]).filter(a => a.id === first || a.id === second);
    localStorage.setItem(this.LS_KEY(this.player!.uid), JSON.stringify(this.randomArchetypes));
  }

  private pickRandom(arr: number[]): number {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  public selectCompany(company: string): void {
    if (this.player?.status === 'ready') return;
    this.form.get('company')?.setValue(company);
  }

  public randomize(what: 'name' | 'surname'): void {
    if (!this.player || !this.missionId) return;
    if (this.player.status === 'ready') return;

    const agentNames = import('../../../environment/agentsNamesSurnames').then(module => {
      const namesArray = module.AGENT_NAME;
      const surnamesArray = module.AGENT_SURNAME;

      switch (what) {
        case 'name':
          this.form.get('name')?.setValue(namesArray[Math.floor(Math.random() * namesArray.length)]);
          break;

        case 'surname':
          this.form.get('surname')?.setValue(surnamesArray[Math.floor(Math.random() * surnamesArray.length)]);
          break;
      }
    });
  }

  public selectArchetype(archetype: Archetype): void {
    this.form.get('archetype')?.setValue(archetype);
    this.roles = this.allRoles[archetype.id].list;
  }

  public selectRole(role: string): void {
    this.form.get('role')?.setValue(role);
  }

  public openSaveConfirmDialog(): void {
    this.dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: this.windowSize <= 768 ? FULL_SIZE_DIALOG : SMALL_SIZE_DIALOG,
      ...DIALOGS_CONFIG,
      disableClose: true,
    });

    this.dialogRef.closed.subscribe((result) => {
      if (result?.status === 'confirmed' && this.player && this.missionId) {
        const { roles, ...archetypeWithoutRoles } = this.form.value.archetype;
        const payload = {
          ...this.form.value,
          archetype: archetypeWithoutRoles
        };

        this.missionService.completeAgentSetup(this.missionId, this.player.uid, payload).then(() => {
          localStorage.removeItem(this.LS_KEY(this.player!.uid));
          this.notificationService.notify('Agent setup saved successfully!', 'check');
          this.missionService.newChatLog({
            timestamp: Timestamp.now(),
            senderPlayer: `Agent_${this.player!.order}`,
            message: `has completed their agent setup and is ready for the mission.`,
            class: 'system-message'
          }, this.missionId!);
        });
      } else {
        this.notificationService.notify('Agent setup save cancelled.', 'info');
      }
    });
  }

  // CHAT LOG

  // public sendMessage(): void {
  //   if (!this.player || this.chatForm.invalid) return;

  //   const rawMessage = this.chatForm.value.message.trim();
  //   const [command, ...args] = rawMessage.split(' ');
  //   const lowerCommand = command.toLowerCase();

  //   // Registro dei comandi speciali
  //   const commandHandlers: Record<string, (msg: string) => { message: string; class?: string }> = {
  //     '/shout': (msg) => ({
  //       message: msg.toUpperCase(),
  //       class: 'shout-message'
  //     }),
  //     // aggiungerai altri qui, tipo /roll, /whisper, ecc.
  //   };

  //   let formattedMessage = rawMessage;
  //   let messageClass = '';

  //   if (commandHandlers[lowerCommand]) {
  //     const { message, class: cssClass } = commandHandlers[lowerCommand](args.join(' '));
  //     formattedMessage = message;
  //     messageClass = cssClass ?? '';
  //   }

  //   const newLog = {
  //     timestamp: Timestamp.now(),
  //     senderPlayer: `Agent_${this.player.order}`,
  //     message: formattedMessage,
  //     class: messageClass
  //   };

  //   this.missionService.newChatLog(newLog, this.missionId!).then(() => {
  //     this.chatForm.reset();
  //   });
  // }

  // public openChatHelpDialog(): void {
  //   this.dialogRef = this.dialog.open(ChatHelpDialogComponent, {
  //     width: this.windowSize <= 768 ? FULL_SIZE_DIALOG : SMALL_SIZE_DIALOG,
  //     ...DIALOGS_CONFIG
  //   });
  // }

  // public openDeleteLogsDialog(): void {
  //   this.dialogRef = this.dialog.open(DeleteDialogComponent, {
  //     width: this.windowSize <= 768 ? FULL_SIZE_DIALOG : SMALL_SIZE_DIALOG,
  //     ...DIALOGS_CONFIG,
  //     disableClose: true,
  //   });

  //   this.dialogRef.closed.subscribe((result) => {
  //     if (result?.status === 'confirmed') {
  //       this.missionService.emptyChatLogs(this.missionId!).then(() => {
  //         this.notificationService.notify('Chat logs deleted successfully!', 'check');
  //       });
  //     }
  //   });
  // }

  // OTHER THINGS

  public openLobbyHelp(): void {
    this.dialogRef = this.dialog.open(HelpLobbyDialogComponent, {
      width: this.windowSize <= 768 ? FULL_SIZE_DIALOG : SMALL_SIZE_DIALOG,
      ...DIALOGS_CONFIG
    });
  }
}
