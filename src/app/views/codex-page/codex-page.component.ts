import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { APP_TITLE_LINES } from '../../../environment/titleLines';
import { TabMenuContainerComponent } from '../../components/tab-menu-container/tab-menu-container.component';
import { UI_SOUNDS_DIRECTIVES } from '../../../environment/uiSounds';
import { LanguageService } from '../../services/language.service';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { KeyValuePipe, UpperCasePipe } from '@angular/common';

interface CodexIndexEntry {
  id: string;
  title: { [key: string]: string };
  category: string;
  type: string;
  tags: string[];
  styleOptions: string[];
}

@Component({
  selector: 'app-codex-page',
  imports: [RouterLink, TabMenuContainerComponent, CdkAccordionModule, KeyValuePipe, UpperCasePipe, UI_SOUNDS_DIRECTIVES],
  templateUrl: './codex-page.component.html',
  styleUrl: './codex-page.component.scss'
})
export class CodexPageComponent {
  public titleLines = APP_TITLE_LINES;
  public resolvedData: any;
  public lang: string = 'en';
  public groupedLore: Record<string, CodexIndexEntry[]> = {};

  constructor(
    private languageService: LanguageService,
    private route: ActivatedRoute
  ) { 
    this.lang = this.languageService.currentLanguageValue;
  }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.resolvedData = data['resolved'];
      const loreIndex = this.resolvedData.loreIndex;

      this.groupedLore = loreIndex.reduce((acc: { [x: string]: any[]; }, entry: { type: string | number; }) => {
        if (!acc[entry.type]) acc[entry.type] = [];
        acc[entry.type].push(entry);
        return acc;
      }, {} as Record<string, CodexIndexEntry[]>);
    });
  }

}
