import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private currentLanguage: string = 'en';

  public get currentLanguageValue(): string {
    return this.currentLanguage;
  }

  getDocumentPath(doc: any): string {
    return `/lore/${this.currentLanguage.toLowerCase()}/${doc.id}.md`;
  }

  getDocumentTitle(doc: any): string {
    return doc.title[this.currentLanguage];
  }

  constructor() { }
}
