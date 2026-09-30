'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { StudySessionMode } from '@/features/study/types/study.types';
import { resolveStudyPool } from '@/features/study/utils/study-session.utils';
import { type VocabularyWord } from '@/services/vocabulary';
import type { StudySessionQuota } from './use-study-session-quota';

export interface UseStudyPoolProps {
  cards: VocabularyWord[];
  selectedTopic?: string;
  mode?: StudySessionMode;
  isReviewMode?: boolean;
  sessionQuota: StudySessionQuota;
}

export interface UseStudyPoolReturn {
  resolvedMode: StudySessionMode;
  storageKey: string;
  poolCards: VocabularyWord[];
}

export function useStudyPool({
  cards,
  selectedTopic,
  mode,
  isReviewMode = false,
  sessionQuota,
}: UseStudyPoolProps): UseStudyPoolReturn {
  const tFolders = useTranslations('Vocabulary.Folders');

  const resolvedMode = useMemo(
    () =>
      mode ??
      (isReviewMode ? StudySessionMode.PRACTICE : StudySessionMode.LEARN_NEW),
    [mode, isReviewMode],
  );

  const storageKey = useMemo(
    () =>
      `lumen_study_session_${selectedTopic ? encodeURIComponent(selectedTopic) : 'general'}`,
    [selectedTopic],
  );

  const poolCards = useMemo(
    () =>
      resolveStudyPool(
        cards,
        selectedTopic,
        resolvedMode,
        sessionQuota.newWordsCount,
        sessionQuota.targetCount,
        tFolders('generalTopic'),
      ),
    [
      cards,
      selectedTopic,
      resolvedMode,
      sessionQuota.newWordsCount,
      sessionQuota.targetCount,
      tFolders,
    ],
  );

  return {
    resolvedMode,
    storageKey,
    poolCards,
  };
}
