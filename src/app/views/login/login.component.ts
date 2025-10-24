import { Component } from '@angular/core';
import { appVersion } from '../../../environment/appVersion';
import { ThemeToggleComponent } from '../../components/theme-toggle/theme-toggle.component';
import { ThemeService } from '../../components/theme-toggle/theme.service';

@Component({
  selector: 'app-login',
  imports: [ThemeToggleComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  public appTitleLines = [
    { text: ' █████╗ ██╗  ████████╗███████╗██████╗ ███████╗ ██████╗  ██████╗ ', delay: 0 },
    { text: '██╔══██╗██║  ╚══██╔══╝██╔════╝██╔══██╗██╔════╝██╔════╝ ██╔═══██╗', delay: 200 },
    { text: '███████║██║     ██║   █████╗  ██████╔╝█████╗  ██║  ███╗██║   ██║', delay: 400 },
    { text: '██╔══██║██║     ██║   ██╔══╝  ██╔══██╗██╔══╝  ██║   ██║██║   ██║', delay: 600 },
    { text: '██║  ██║███████╗██║   ███████╗██║  ██║███████╗╚██████╔╝╚██████╔╝', delay: 800 },
    { text: '╚═╝  ╚═╝╚══════╝╚═╝   ╚══════╝╚═╝  ╚═╝╚══════╝ ╚═════╝  ╚═════╝ ', delay: 1000 },
    { text: '                                                                ', delay: 1200 },
    { text: `v. ${appVersion}`, delay: 1400 }
  ];

  public visibleLines: string[] = [];
  public appVersion = '';
  
  ngOnInit() {
    this.appVersion = appVersion;

    this.appTitleLines.forEach((line, index) => {
      setTimeout(() => {
        this.visibleLines.push(line.text);
      }, line.delay);
    });
  }
}
