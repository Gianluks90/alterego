import { Directive, ElementRef, HostListener } from '@angular/core';
import { SoundService } from '../services/sound.service';

@Directive({
  selector: '[standard-button]'
})
export class StandardButtonSoundDirective {

  constructor(private el: ElementRef, private sound: SoundService) { }

  @HostListener('click', ['$event'])
  handleClick(event: MouseEvent) {
    const btn = this.el.nativeElement as HTMLButtonElement;
    if (btn.disabled) return;

    this.sound.playSound('standard-button');
  }
}
