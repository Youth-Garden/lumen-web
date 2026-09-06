'use client';

import { useState, useEffect, useCallback } from 'react';
import { PronunciationAccent } from '@/services/vocabulary/vocabulary.types';

export type LessonQuotaPreset = 'FEW' | 'MODERATE' | 'MANY' | 'A_LOT';

export interface LessonQuotaConfig {
  preset: LessonQuotaPreset;
  label: string;
  rangeText: string;
  targetCount: number;
  minCount: number;
  maxCount: number;
}

export const LESSON_QUOTA_CONFIGS: Record<LessonQuotaPreset, LessonQuotaConfig> = {
  FEW: {
    preset: 'FEW',
    label: 'A few',
    rangeText: '7-10 questions',
    targetCount: 7,
    minCount: 7,
    maxCount: 10,
  },
  MODERATE: {
    preset: 'MODERATE',
    label: 'Moderate',
    rangeText: '10-15 questions',
    targetCount: 10,
    minCount: 10,
    maxCount: 15,
  },
  MANY: {
    preset: 'MANY',
    label: 'Many',
    rangeText: '15-20 questions',
    targetCount: 15,
    minCount: 15,
    maxCount: 20,
  },
  A_LOT: {
    preset: 'A_LOT',
    label: 'A lot',
    rangeText: '20-26 questions',
    targetCount: 20,
    minCount: 20,
    maxCount: 26,
  },
};

export interface StudySettings {
  lessonQuotaPreset: LessonQuotaPreset;
  wordsPerSession: number;
  autoPlayAudio: boolean;
  accent: PronunciationAccent;
}

const DEFAULT_SETTINGS: StudySettings = {
  lessonQuotaPreset: 'A_LOT',
  wordsPerSession: 20,
  autoPlayAudio: true,
  accent: PronunciationAccent.US,
};

const STORAGE_KEY = 'lumen_study_settings';

export function useStudySettings() {
  const [settings, setSettings] = useState<StudySettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<StudySettings>;
        const preset = parsed.lessonQuotaPreset || 'A_LOT';
        const target = LESSON_QUOTA_CONFIGS[preset]?.targetCount || 20;
        setSettings({
          ...DEFAULT_SETTINGS,
          ...parsed,
          lessonQuotaPreset: preset,
          wordsPerSession: target,
        });
      }
    } catch {
      // Fallback to default
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const updateSettings = useCallback((newSettings: Partial<StudySettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      if (newSettings.lessonQuotaPreset && LESSON_QUOTA_CONFIGS[newSettings.lessonQuotaPreset]) {
        updated.wordsPerSession = LESSON_QUOTA_CONFIGS[newSettings.lessonQuotaPreset].targetCount;
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore localStorage errors
      }
      return updated;
    });
  }, []);

  const currentQuotaConfig = LESSON_QUOTA_CONFIGS[settings.lessonQuotaPreset] || LESSON_QUOTA_CONFIGS.A_LOT;

  return {
    settings,
    currentQuotaConfig,
    updateSettings,
    isLoaded,
  };
}
