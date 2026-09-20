import { SoundEffectEnum, type SoundConfig } from '@/shared/types';

export const SOUND_EFFECT_CONFIG: Record<SoundEffectEnum, SoundConfig> = {
  [SoundEffectEnum.STUDY_CORRECT]: {
    src: '/sounds/study/correct.mp3',
    volume: 0.8,
  },
  [SoundEffectEnum.STUDY_INCORRECT]: {
    src: '/sounds/study/incorrect.mp3',
    volume: 0.7,
  },
};
