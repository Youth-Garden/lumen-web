'use client';

import { useState, useEffect, useCallback } from 'react';
import { PronunciationAccent } from '@/services/vocabulary/vocabulary.types';

export interface StudySettings {
  wordsPerSession: number;
  autoPlayAudio: boolean;
  accent: PronunciationAccent;
}

const DEFAULT_SETTINGS: StudySettings = {
  wordsPerSession: 15,
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
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
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
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore localStorage errors
      }
      return updated;
    });
  }, []);

  return {
    settings,
    updateSettings,
    isLoaded,
  };
}
