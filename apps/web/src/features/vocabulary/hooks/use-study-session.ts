'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { usePronunciation } from '@/shared/hooks';
import {
  FlashcardRating,
  PronunciationAccent,
  type VocabularyWord,
} from '@/services/vocabulary/vocabulary.types';
import { useReviewFlashcard } from './use-vocabulary';
import { useStudySettings } from './use-study-settings';
import { useStudyShortcuts } from './use-study-shortcuts';
import type { MissedWordStat, UseStudySessionProps } from './use-study-session.types';
export type { MissedWordStat, UseStudySessionProps };

export function useStudySession({
  cards,
  selectedTopic,
  isOpen,
  onClose,
}: UseStudySessionProps) {
  const { settings, currentQuotaConfig } = useStudySettings();
  const { playPronunciation, isPlaying, playingAccent } = usePronunciation();
  const reviewMutation = useReviewFlashcard();

  // Filter pool by topic if selected
  const poolCards = useMemo(() => {
    let list = cards;
    if (selectedTopic) {
      list = cards.filter((card) => {
        const top = card.topic?.trim() || 'Chủ đề chung';
        return top === selectedTopic;
      });
    }

    const count = settings.wordsPerSession || currentQuotaConfig.targetCount || 20;
    return list.slice(0, count);
  }, [cards, selectedTopic, settings.wordsPerSession, currentQuotaConfig.targetCount]);

  const [activeQueue, setActiveQueue] = useState<VocabularyWord[]>([]);
  const [reviewQueue, setReviewQueue] = useState<VocabularyWord[]>([]);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isReviewPhase, setIsReviewPhase] = useState(false);
  const [missedWordsMap, setMissedWordsMap] = useState<
    Record<string, MissedWordStat>
  >({});
  const canFlipRef = useRef(true);

  // Initialize session
  useEffect(() => {
    if (isOpen && poolCards.length > 0) {
      setActiveQueue(poolCards);
      setReviewQueue([]);
      setMasteredIds([]);
      setIsReviewPhase(false);
      setIsFlipped(false);
      setMissedWordsMap({});
      canFlipRef.current = false;
      const timer = setTimeout(() => {
        canFlipRef.current = true;
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [isOpen, poolCards]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const currentCard = activeQueue[0];
  const isFinished =
    poolCards.length > 0 &&
    activeQueue.length === 0 &&
    reviewQueue.length === 0;
  const progressPercent =
    poolCards.length > 0
      ? (masteredIds.length / poolCards.length) * 100
      : 0;

  const activePhonetic = useMemo(() => {
    if (!currentCard) return '';
    if (settings.accent === 'uk')
      return currentCard.phoneticUk || currentCard.phonetic || '';
    return currentCard.phoneticUs || currentCard.phonetic || '';
  }, [currentCard, settings.accent]);

  const currentCardMastery = useMemo(() => {
    if (!currentCard) return 1;
    return (currentCard.id.charCodeAt(0) % 5) + 1;
  }, [currentCard]);

  // Audio Handlers
  const handlePlayUsAudio = useCallback(() => {
    if (!currentCard) return;
    playPronunciation({
      term: currentCard.term,
      audioUrl: currentCard.audioUrl || undefined,
      audioUsUrl: currentCard.audioUsUrl || undefined,
      accent: PronunciationAccent.US,
    });
  }, [currentCard, playPronunciation]);

  const handlePlayUkAudio = useCallback(() => {
    if (!currentCard) return;
    playPronunciation({
      term: currentCard.term,
      audioUkUrl: currentCard.audioUkUrl || undefined,
      accent: PronunciationAccent.UK,
    });
  }, [currentCard, playPronunciation]);

  const handlePlayAudio = useCallback(() => {
    if (settings.accent === 'uk') handlePlayUkAudio();
    else handlePlayUsAudio();
  }, [settings.accent, handlePlayUkAudio, handlePlayUsAudio]);

  // Auto-play audio on new card
  useEffect(() => {
    if (
      !isOpen ||
      isFinished ||
      !currentCard ||
      !settings.autoPlayAudio
    )
      return;
    const timer = setTimeout(() => {
      handlePlayAudio();
    }, 250);
    return () => clearTimeout(timer);
  }, [
    currentCard,
    isOpen,
    isFinished,
    settings.autoPlayAudio,
    handlePlayAudio,
  ]);

  const handleFlip = useCallback(() => {
    if (!canFlipRef.current) return;
    setIsFlipped((prev) => !prev);
  }, []);

  const recordMissedWord = useCallback((card: VocabularyWord) => {
    setMissedWordsMap((prev) => {
      const existing = prev[card.id];
      return {
        ...prev,
        [card.id]: {
          card,
          errorCount: (existing?.errorCount || 0) + 1,
        },
      };
    });
  }, []);

  // Action 1: "Thông thạo - Nhấn 1" (Mastered / Easy)
  const handleMastered = useCallback(async () => {
    if (!currentCard || reviewMutation.isPending) return;

    try {
      await reviewMutation.mutateAsync({
        flashcardId: currentCard.id,
        quality: FlashcardRating.EASY,
      });
    } catch (error) {
      console.error('Failed to update flashcard progress:', error);
    }

    setMasteredIds((prev) =>
      prev.includes(currentCard.id) ? prev : [...prev, currentCard.id],
    );
    setIsFlipped(false);

    const remaining = activeQueue.slice(1);
    if (remaining.length > 0) {
      setActiveQueue(remaining);
    } else if (reviewQueue.length > 0) {
      // Switch review queue to active
      setActiveQueue(reviewQueue);
      setReviewQueue([]);
      setIsReviewPhase(true);
    } else {
      setActiveQueue([]);
    }
  }, [currentCard, activeQueue, reviewQueue, reviewMutation]);

  // Action 2: "Nhớ tạm - Nhấn 3" (Hard / Need Review)
  const handleReview = useCallback(async () => {
    if (!currentCard || reviewMutation.isPending) return;

    try {
      await reviewMutation.mutateAsync({
        flashcardId: currentCard.id,
        quality: FlashcardRating.HARD,
      });
    } catch (error) {
      console.error('Failed to update flashcard progress:', error);
    }

    setIsFlipped(false);

    const remaining = activeQueue.slice(1);
    const newReview = [...reviewQueue, currentCard];

    if (remaining.length > 0) {
      setActiveQueue(remaining);
      setReviewQueue(newReview);
    } else {
      // Cycle reviewQueue
      setActiveQueue(newReview);
      setReviewQueue([]);
      setIsReviewPhase(true);
    }
  }, [currentCard, activeQueue, reviewQueue, reviewMutation]);

  // Action 3: "Chưa biết - Nhấn Enter" (Again)
  const handleDontKnow = useCallback(async () => {
    if (!currentCard || reviewMutation.isPending) return;
    recordMissedWord(currentCard);

    try {
      await reviewMutation.mutateAsync({
        flashcardId: currentCard.id,
        quality: FlashcardRating.AGAIN,
      });
    } catch (error) {
      console.error('Failed to update flashcard progress:', error);
    }

    setIsFlipped(false);

    const remaining = activeQueue.slice(1);
    // Put to end of active queue so it is tested again in this round
    setActiveQueue([...remaining, currentCard]);
  }, [currentCard, activeQueue, reviewMutation, recordMissedWord]);

  const handleRestart = useCallback(() => {
    setActiveQueue(poolCards);
    setReviewQueue([]);
    setMasteredIds([]);
    setIsReviewPhase(false);
    setIsFlipped(false);
    setMissedWordsMap({});
  }, [poolCards]);

  const missedWordsList: MissedWordStat[] = useMemo(() => {
    return Object.values(missedWordsMap).sort(
      (a, b) => b.errorCount - a.errorCount,
    );
  }, [missedWordsMap]);

  // Global Keyboard Shortcuts (Extracted to dedicated hook)
  useStudyShortcuts({
    isOpen,
    isFinished,
    isFlipped,
    canFlipRef,
    onFlip: handleFlip,
    onMastered: handleMastered,
    onReview: handleReview,
    onDontKnow: handleDontKnow,
    onPlayUsAudio: handlePlayUsAudio,
    onPlayUkAudio: handlePlayUkAudio,
    onClose,
  });

  return {
    activeQueue,
    reviewQueue,
    poolCards,
    masteredIds,
    currentCard,
    isReviewPhase,
    quotaRangeText: currentQuotaConfig.rangeText,
    isFlipped,
    isFinished,
    progressPercent,
    activePhonetic,
    currentCardMastery,
    canFlipRef,
    isSubmitting: reviewMutation.isPending,
    playingAccent,
    isPlaying,
    missedWordsList,
    settings,
    handleFlip, handleMastered, handleReview, handleDontKnow, handleRestart,
    handlePlayUsAudio, handlePlayUkAudio, handlePlayAudio,
  };
}
