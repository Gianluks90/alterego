import { Component, ViewEncapsulation } from '@angular/core';
import { TerminalInputComponent } from '../../components/terminal-input/terminal-input.component';
import { CommandService } from '../../services/command.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [TerminalInputComponent],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {
  constructor(private commandService: CommandService) { }

  public lines = [
    { text: '██╗  ██╗ ██████╗ ██╗  ██╗', delay: 400 },
    { text: '██║  ██║██╔═████╗██║  ██║', delay: 600 },
    { text: '███████║██║██╔██║███████║', delay: 800 },
    { text: '╚════██║████╔╝██║╚════██║', delay: 1000 },
    { text: '     ██║╚██████╔╝     ██║', delay: 1200 },
    { text: '     ╚═╝ ╚═════╝      ╚═╝', delay: 1250 },
    { text: '                         ', delay: 1300 },
    { text: 'ALT OS SYSTEM WARNING', delay: 1350 },
    { text: '-----------------------------------------------------------', delay: 1550 },
    { text: 'Error code: 404', delay: 1750 },
    { text: 'Message: Requested path not found in current directory.', delay: 1950 },
    { text: '-----------------------------------------------------------', delay: 2150 },
    { text: 'Type \'/nav back\' to return to the main console.', delay: 2350 },
  ];

  onExecuteCommand(command: string) {
    switch (command.trim().toLowerCase()) {
      case '/restart':
        window.location.href = '/';
        break;
      default:
        this.commandService.execute(command);
    }
  }
}
