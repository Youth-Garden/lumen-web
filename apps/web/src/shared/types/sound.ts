export enum SoundEffectEnum {
  STUDY_CORRECT = 'study.correct',
  STUDY_INCORRECT = 'study.incorrect',
}

export interface SoundConfig {
  src: string;
  volume?: number;
}

export interface PlaySoundOptions {
  volume?: number;
  rate?: number;
}
