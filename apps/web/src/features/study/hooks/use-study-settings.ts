'use client';

import { useCallback } from 'react';
import {
  LessonQuotaPreset,
  LESSON_QUOTA_CONFIGS,
  type LessonQuotaConfig,
} from '@/services/study';
import type { PronunciationAccent } from '@/services/vocabulary';
import { usePreferencesStore } from '@/store';

export interface StudySettings {
  lessonQuotaPreset: LessonQuotaPreset;
  wordsPerSession: number;
  autoPlayAudio: boolean;
  soundEffectsEnabled: boolean;
  accent: PronunciationAccent;
}

export function useStudySettings() {
  const soundEffectsEnabled = usePreferencesStore((s) => s.soundEffectsEnabled);
  const autoPlayAudio = usePreferencesStore((s) => s.autoPlayAudio);
  const accent = usePreferencesStore((s) => s.accent);
  const lessonQuotaPreset = usePreferencesStore((s) => s.lessonQuotaPreset);
  const wordsPerSession = usePreferencesStore((s) => s.wordsPerSession);
  const updatePreferences = usePreferencesStore((s) => s.updatePreferences);

  const settings: StudySettings = {
    soundEffectsEnabled,
    autoPlayAudio,
    accent,
    lessonQuotaPreset,
    wordsPerSession,
  };

  const updateSettings = useCallback(
    (newSettings: Partial<StudySettings>) => {
      updatePreferences(newSettings);
    },
    [updatePreferences],
  );

  const currentQuotaConfig =
    LESSON_QUOTA_CONFIGS[lessonQuotaPreset] || LESSON_QUOTA_CONFIGS.A_LOT;

  return {
    settings,
    currentQuotaConfig,
    updateSettings,
    isLoaded: true,
  };
}
