/**
 * SoundService for the Web App
 * Provides simple audio notifications using the browser's Audio API.
 */

const SOUNDS = {
  newLoad: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3', // Modern notification
  success: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3', // Success ding
  error: 'https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3',   // Error/Alert
};

class SoundService {
  private static instance: SoundService;
  private audioEnabled = true;

  private constructor() {}

  public static getInstance(): SoundService {
    if (!SoundService.instance) {
      SoundService.instance = new SoundService();
    }
    return SoundService.instance;
  }

  public setEnabled(enabled: boolean) {
    this.audioEnabled = enabled;
  }

  private async play(url: string, volume = 0.5) {
    if (!this.audioEnabled) return;

    try {
      const audio = new Audio(url);
      audio.volume = volume;
      await audio.play();
    } catch (error) {
      // Browser often blocks audio until user interaction
      console.warn('Audio playback blocked or failed:', error);
    }
  }

  public playNewLoad() {
    this.play(SOUNDS.newLoad, 0.4);
  }

  public playSuccess() {
    this.play(SOUNDS.success, 0.5);
  }

  public playError() {
    this.play(SOUNDS.error, 0.3);
  }
}

export const soundService = SoundService.getInstance();
