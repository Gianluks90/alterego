import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { APP_TITLE_LINES } from '../../../environment/titleLines';

@Component({
  selector: 'app-codex-page',
  imports: [RouterLink],
  templateUrl: './codex-page.component.html',
  styleUrl: './codex-page.component.scss'
})
export class CodexPageComponent {
  public titleLines = APP_TITLE_LINES;
}
