import { LessonQuotaPreset, type LessonQuotaConfig } from './study.types';

export const LESSON_QUOTA_CONFIGS: Record<
  LessonQuotaPreset,
  LessonQuotaConfig
> = {
  [LessonQuotaPreset.FEW]: {
    preset: LessonQuotaPreset.FEW,
    targetCount: 7,
    minCount: 7,
    maxCount: 10,
  },
  [LessonQuotaPreset.MODERATE]: {
    preset: LessonQuotaPreset.MODERATE,
    targetCount: 10,
    minCount: 10,
    maxCount: 15,
  },
  [LessonQuotaPreset.MANY]: {
    preset: LessonQuotaPreset.MANY,
    targetCount: 15,
    minCount: 15,
    maxCount: 20,
  },
  [LessonQuotaPreset.A_LOT]: {
    preset: LessonQuotaPreset.A_LOT,
    targetCount: 20,
    minCount: 20,
    maxCount: 26,
  },
};
