import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { SoundService } from '../services/sound.service';

export const soundResolver: ResolveFn<Promise<boolean>> = async () => {
  const soundService = inject(SoundService);

  const soundsToPreload = [
    'standard-button',
    // Aggiungi altri suoni UI qui se necessario
  ];

  try {
    await soundService.preload(soundsToPreload);
    console.log('[ OK ] UI sounds preloaded');
    return true;
  } catch (err) {
    console.error('[ ERROR ] Error preloading sounds:', err);
    return false;
  }
};