import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {

  constructor() { 
    this.audioContext = new AudioContext();
    const storedPreference = localStorage.getItem('playSounds');
    this.playSounds = storedPreference !== 'false';
  }

  private audioContext: AudioContext;
  private buffers: Map<string, AudioBuffer> = new Map();

  private currentSource: AudioBufferSourceNode | null = null;

  public async preload(sounds: string[]): Promise<void> {
    const promises = sounds.map(async (soundName) => {
      const response = await fetch(`/sounds/${soundName}.mp3`);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.buffers.set(soundName, audioBuffer);
    });
    await Promise.all(promises);
  }

  public playSounds: boolean = true;
  public toggleSounds(): void {
    this.playSounds = !this.playSounds;
    localStorage.setItem('playSounds', this.playSounds ? 'true' : 'false');
  }

  public playSound(soundUrl: string): void {
    if (!this.playSounds) return;

    const buffer = this.buffers.get(soundUrl);
    if (buffer) {
      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(this.audioContext.destination);
      source.start(0);
      this.currentSource = source;
    } else {
      console.warn(`Sound ${soundUrl} not preloaded.`);
    }
  }

  public stopSound(): void {
    if (this.currentSource) {
      this.currentSource.stop();
      this.currentSource = null;
    }
  }
}
