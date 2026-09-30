'use client';

import { useEffect, useState } from 'react';
import { useStudySettings } from './use-study-settings';

export interface StudySessionQuota {
  newWordsCount: number;
  targetCount: number;
}

export function useStudySessionQuota(isOpen: boolean): StudySessionQuota {
  const { settings, currentQuotaConfig } = useStudySettings();

  const [sessionQuota, setSessionQuota] = useState<StudySessionQuota>(() => ({
    newWordsCount: currentQuotaConfig.newWordsCount || 5,
    targetCount:
      settings.wordsPerSession || currentQuotaConfig.targetCount || 20,
  }));

  useEffect(() => {
    if (!isOpen) {
      setSessionQuota({
        newWordsCount: currentQuotaConfig.newWordsCount || 5,
        targetCount:
          settings.wordsPerSession || currentQuotaConfig.targetCount || 20,
      });
    }
  }, [
    isOpen,
    currentQuotaConfig.newWordsCount,
    currentQuotaConfig.targetCount,
    settings.wordsPerSession,
  ]);

  return sessionQuota;
}
