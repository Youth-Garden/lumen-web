'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useBatchReviewFlashcards } from './use-study';

export interface PendingReviewItem {
  flashcardId: string;
  isCorrect: boolean;
  isFastTrackKnown?: boolean;
  isFastTrackTempMemory?: boolean;
}

export function useStudyReviews(isFinished: boolean) {
  const batchReviewMutation = useBatchReviewFlashcards();
  const pendingReviewsRef = useRef<Map<string, PendingReviewItem>>(new Map());

  const recordReviewPending = useCallback(
    (
      flashcardId: string,
      data: {
        isCorrect: boolean;
        isFastTrackKnown?: boolean;
        isFastTrackTempMemory?: boolean;
      },
    ) => {
      pendingReviewsRef.current.set(flashcardId, {
        flashcardId,
        isCorrect: data.isCorrect,
        isFastTrackKnown: data.isFastTrackKnown,
        isFastTrackTempMemory: data.isFastTrackTempMemory,
      });
    },
    [],
  );

  const flushPendingReviews = useCallback(() => {
    if (pendingReviewsRef.current.size === 0) return;
    const reviews = Array.from(pendingReviewsRef.current.values());
    pendingReviewsRef.current.clear();
    try {
      batchReviewMutation.mutate({ reviews });
    } catch {}
  }, [batchReviewMutation]);

  const clearPendingReviews = useCallback(() => {
    pendingReviewsRef.current.clear();
  }, []);

  useEffect(() => {
    if (isFinished) {
      flushPendingReviews();
    }
  }, [isFinished, flushPendingReviews]);

  return {
    recordReviewPending,
    flushPendingReviews,
    clearPendingReviews,
    isSubmitting: batchReviewMutation.isPending,
  };
}
