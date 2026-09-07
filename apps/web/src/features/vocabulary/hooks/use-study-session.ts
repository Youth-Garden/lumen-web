'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { toast } from 'sonner';
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
  const t = useTranslations('Vocabulary.Study');
  const tFolders = useTranslations('Vocabulary.Folders');
  const { settings, currentQuotaConfig } = useStudySettings();
  const { playPronunciation, isPlaying, playingAccent } = usePronunciation();
  const reviewMutation = useReviewFlashcard();

  const storageKey = useMemo(
    () => `lumen_study_session_${selectedTopic ? encodeURIComponent(selectedTopic) : 'general'}`,
    [selectedTopic]
  );

  // Filter pool by topic if selected
  const poolCards = useMemo(() => {
    let list = cards;
    if (selectedTopic) {
      list = cards.filter((card) => {
        const top = card.topic?.trim() || tFolders('generalTopic');
        return top === selectedTopic;
      });
    }

    const count = settings.wordsPerSession || currentQuotaConfig.targetCount || 20;
    return list.slice(0, count);
  }, [cards, selectedTopic, settings.wordsPerSession, currentQuotaConfig.targetCount, tFolders]);

  const [activeQueue, setActiveQueue] = useState<VocabularyWord[]>([]);
  const [reviewQueue, setReviewQueue] = useState<VocabularyWord[]>([]);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isReviewPhase, setIsReviewPhase] = useState(false);
  const [missedWordsMap, setMissedWordsMap] = useState<
    Record<string, MissedWordStat>
  >({});
  const canFlipRef = useRef(true);

  // Initialize or restore session
  useEffect(() => {
    if (!isOpen || poolCards.length === 0) return;

    // Check for saved progress in localStorage
    try {
      const savedRaw = localStorage.getItem(storageKey);
      if (savedRaw) {
        const saved = JSON.parse(savedRaw);
        if (
          Array.isArray(saved?.activeQueueIds) &&
          (saved.activeQueueIds.length > 0 || (saved.reviewQueueIds && saved.reviewQueueIds.length > 0))
        ) {
          const cardMap = new Map(poolCards.map((c) => [c.id, c]));
          const restoredActive = (saved.activeQueueIds as string[])
            .map((id) => cardMap.get(id))
            .filter(Boolean) as VocabularyWord[];
          const restoredReview = ((saved.reviewQueueIds || []) as string[])
            .map((id) => cardMap.get(id))
            .filter(Boolean) as VocabularyWord[];

          if (restoredActive.length > 0 || restoredReview.length > 0) {
            setActiveQueue(restoredActive);
            setReviewQueue(restoredReview);
            setMasteredIds(saved.masteredIds || []);
            setIsReviewPhase(Boolean(saved.isReviewPhase));
            setIsFlipped(false);
            setMissedWordsMap(saved.missedWordsMap || {});
            canFlipRef.current = false;
            const timer = setTimeout(() => {
              canFlipRef.current = true;
            }, 250);
            return () => clearTimeout(timer);
          }
        }
      }
    } catch {
      // ignore
    }

    // Default init
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
  }, [poolCards, isOpen, storageKey]);

  // Current Card
  const currentCard = activeQueue[0] || null;

  // Auto-flip debouncing protection
  useEffect(() => {
    canFlipRef.current = false;
    const timer = setTimeout(() => {
      canFlipRef.current = true;
    }, 200);
    return () => clearTimeout(timer);
  }, [currentCard?.id]);

  // Status flags
  const isFinished = poolCards.length > 0 && activeQueue.length === 0 && reviewQueue.length === 0;
  const progressPercent = poolCards.length > 0 ? (masteredIds.length / poolCards.length) * 100 : 0;

  // Phonetic based on accent
  const activePhonetic = useMemo(() => {
    if (!currentCard) return '';
    if (settings.accent === PronunciationAccent.UK && currentCard.phoneticUk) {
      return currentCard.phoneticUk;
    }
    return currentCard.phoneticUs || currentCard.phonetic || '';
  }, [currentCard, settings.accent]);

  // Plant growth mastery stage (0 to 5)
  const currentCardMastery = useMemo(() => {
    if (!currentCard) return 0;
    if (isReviewPhase) {
      const rep = (currentCard as any).repetitions;
      return rep ? Math.min(5, Math.max(1, Number(rep))) : 1;
    }
    if (masteredIds.includes(currentCard.id)) {
      return 1;
    }
    return 0;
  }, [currentCard, isReviewPhase, masteredIds]);

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
      setActiveQueue(reviewQueue);
      setReviewQueue([]);
      setIsReviewPhase(true);
    } else {
      setActiveQueue([]);
    }
  }, [currentCard, activeQueue, reviewQueue, reviewMutation]);

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
      setActiveQueue(newReview);
      setReviewQueue([]);
      setIsReviewPhase(true);
    }
  }, [currentCard, activeQueue, reviewQueue, reviewMutation]);

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
    setActiveQueue([...remaining, currentCard]);
  }, [currentCard, activeQueue, reviewMutation, recordMissedWord]);

  const handleRestart = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch {}
    setActiveQueue(poolCards);
    setReviewQueue([]);
    setMasteredIds([]);
    setIsReviewPhase(false);
    setIsFlipped(false);
    setMissedWordsMap({});
  }, [poolCards, storageKey]);

  const handleSaveProgress = useCallback(() => {
    if (!isOpen || poolCards.length === 0) return;

    try {
      const payload = {
        activeQueueIds: activeQueue.map((c) => c.id),
        reviewQueueIds: reviewQueue.map((c) => c.id),
        masteredIds,
        isReviewPhase,
        missedWordsMap,
        updatedAt: Date.now(),
      };
      localStorage.setItem(storageKey, JSON.stringify(payload));
      toast.success(t('saveProgressSuccess'));
    } catch (err) {
      console.error('Failed to save study progress:', err);
      toast.error(t('saveProgressError'));
    }
  }, [
    isOpen,
    poolCards.length,
    activeQueue,
    reviewQueue,
    masteredIds,
    isReviewPhase,
    missedWordsMap,
    storageKey,
    t,
  ]);

  const missedWordsList: MissedWordStat[] = useMemo(() => {
    return Object.values(missedWordsMap).sort(
      (a, b) => b.errorCount - a.errorCount,
    );
  }, [missedWordsMap]);

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
    handleFlip,
    handleMastered,
    handleReview,
    handleDontKnow,
    handleRestart,
    handleSaveProgress,
    handlePlayUsAudio,
    handlePlayUkAudio,
    handlePlayAudio,
  };
}
