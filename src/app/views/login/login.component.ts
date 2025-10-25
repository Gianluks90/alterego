import { Component } from '@angular/core';
import { appVersion } from '../../../environment/appVersion';
import { ThemeToggleComponent } from '../../components/theme-toggle/theme-toggle.component';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '../../components/dialogs/login-dialog/login-dialog.component';
import { TerminalInputComponent } from '../../components/terminal-input/terminal-input.component';
import { HelpDialogComponent } from '../../components/dialogs/help-dialog/help-dialog.component';
import { CommandService } from '../../services/command.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ThemeToggleComponent, TerminalInputComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  public appTitleLines = [
    { text: ' █████╗ ██╗  ████████╗███████╗██████╗ ███████╗ ██████╗  ██████╗ ', delay: 400 },
    { text: '██╔══██╗██║  ╚══██╔══╝██╔════╝██╔══██╗██╔════╝██╔════╝ ██╔═══██╗', delay: 600 },
    { text: '███████║██║     ██║   █████╗  ██████╔╝█████╗  ██║  ███╗██║   ██║', delay: 800 },
    { text: '██╔══██║██║     ██║   ██╔══╝  ██╔══██╗██╔══╝  ██║   ██║██║   ██║', delay: 1000 },
    { text: '██║  ██║███████╗██║   ███████╗██║  ██║███████╗╚██████╔╝╚██████╔╝', delay: 1200 },
    { text: '╚═╝  ╚═╝╚══════╝╚═╝   ╚══════╝╚═╝  ╚═╝╚══════╝ ╚═════╝  ╚═════╝ ', delay: 1400 },
    { text: '                                                                ', delay: 1600 },
    { text: `v. ${appVersion}`, delay: 1800 }
  ];

  public visibleLines: string[] = [];
  public appVersion = '';

  constructor(private dialog: MatDialog, private commandService: CommandService) {}
  
  ngOnInit() {
    this.appVersion = appVersion;

    this.appTitleLines.forEach((line, index) => {
      setTimeout(() => {
        this.visibleLines.push(line.text);
      }, line.delay);
    });
  }

  onExecuteCommand(command: string) {
    switch(command.trim().toLowerCase()) {
      case '/help':
        this.openHelpDialog();
        break;
        
      default:
        this.commandService.execute(command);
    }
  }

  public openHelpDialog() {
    this.dialog.open(HelpDialogComponent, {
      width: '600px',
      backdropClass: 'backdrop-blur',
      panelClass: 'generic-dialog-panel',
      autoFocus: false,
      enterAnimationDuration: '0ms',
    });
  }
}
