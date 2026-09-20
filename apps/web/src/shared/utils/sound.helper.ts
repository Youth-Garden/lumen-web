import { SOUND_EFFECT_CONFIG } from '@/shared/constants';
import { SoundEffectEnum, type PlaySoundOptions } from '@/shared/types';
import { usePreferencesStore } from '@/store';

class SoundHelper {
  private audioPool: Map<SoundEffectEnum, HTMLAudioElement[]> = new Map();
  private maxPoolSize = 3;

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof Audio !== 'undefined';
  }

  public isSoundEnabled(): boolean {
    if (!this.isBrowser()) return false;
    return usePreferencesStore.getState().soundEffectsEnabled;
  }

  private getAudioInstance(sound: SoundEffectEnum): HTMLAudioElement | null {
    if (!this.isBrowser()) return null;

    const pool = this.audioPool.get(sound) || [];
    const available = pool.find((audio) => audio.paused || audio.ended);

    if (available) {
      return available;
    }

    if (pool.length < this.maxPoolSize) {
      const config = SOUND_EFFECT_CONFIG[sound];
      if (!config) return null;

      const audio = new Audio(config.src);
      audio.preload = 'auto';
      pool.push(audio);
      this.audioPool.set(sound, pool);
      return audio;
    }

    return pool[0] || null;
  }

  public preloadAll(): void {
    if (!this.isBrowser()) return;

    Object.values(SoundEffectEnum).forEach((sound) => {
      this.getAudioInstance(sound);
    });
  }

  public play(sound: SoundEffectEnum, options?: PlaySoundOptions): void {
    if (!this.isBrowser() || !this.isSoundEnabled()) return;

    const audio = this.getAudioInstance(sound);
    if (!audio) return;

    const config = SOUND_EFFECT_CONFIG[sound];
    const globalVolume = usePreferencesStore.getState().soundVolume ?? 0.8;
    const targetVolume =
      (options?.volume ?? config?.volume ?? 0.8) * globalVolume;

    try {
      audio.currentTime = 0;
      audio.volume = Math.max(0, Math.min(1, targetVolume));
      if (options?.rate) {
        audio.playbackRate = options.rate;
      }
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } catch {}
  }

  public playStudyCorrect(options?: PlaySoundOptions): void {
    this.play(SoundEffectEnum.STUDY_CORRECT, options);
  }

  public playStudyIncorrect(options?: PlaySoundOptions): void {
    this.play(SoundEffectEnum.STUDY_INCORRECT, options);
  }
}

export const soundHelper = new SoundHelper();
