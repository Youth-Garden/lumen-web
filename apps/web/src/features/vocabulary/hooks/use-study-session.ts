'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useReviewFlashcard } from './index';
import { useStudySettings } from './use-study-settings';
import { PronunciationAccent, type VocabularyWord } from '@/services/vocabulary/vocabulary.types';
import { usePronunciation } from '@/shared/hooks';

interface UseStudySessionProps {
  cards: VocabularyWord[];
  isOpen: boolean;
  onClose: () => void;
}

export interface StudySessionState {
  queue: VocabularyWord[];
  masteredIds: string[];
  reviewCount: number;
  gotItCount: number;
  isFlipped: boolean;
  currentCard: VocabularyWord | undefined;
  totalInBatch: number;
  isFinished: boolean;
  progressPercent: number;
  activePhonetic: string;
  currentCardMastery: number;
  canFlipRef: React.RefObject<boolean>;
  isSubmitting: boolean;
  playingAccent: PronunciationAccent | null;
  isPlaying: boolean;
  settings: ReturnType<typeof useStudySettings>['settings'];
}

export interface StudySessionHandlers {
  handleFlip: () => void;
  handleReview: () => Promise<void>;
  handleGotIt: () => Promise<void>;
  handleRestart: () => void;
  handlePlayUsAudio: () => void;
  handlePlayUkAudio: () => void;
  handlePlayAudio: () => void;
}

export function useStudySession({ cards, isOpen, onClose }: UseStudySessionProps): StudySessionState & StudySessionHandlers {
  const { settings } = useStudySettings();
  const { playPronunciation, isPlaying, playingAccent } = usePronunciation();
  const reviewMutation = useReviewFlashcard();
  const canFlipRef = useRef(false);

  const initialBatch = useMemo(() => {
    if (settings.wordsPerSession > 0 && settings.wordsPerSession < cards.length) {
      return cards.slice(0, settings.wordsPerSession);
    }
    return cards;
  }, [cards, settings.wordsPerSession]);

  const [queue, setQueue] = useState<VocabularyWord[]>(() => initialBatch);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [gotItCount, setGotItCount] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setQueue(initialBatch);
      setMasteredIds([]);
      setReviewCount(0);
      setGotItCount(0);
      setIsFlipped(false);
      canFlipRef.current = false;
      const timer = setTimeout(() => { canFlipRef.current = true; }, 250);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialBatch]);

  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = originalOverflow; };
    }
  }, [isOpen]);

  const currentCard = queue[0];
  const totalInBatch = initialBatch.length;
  const isFinished = totalInBatch > 0 && queue.length === 0 && masteredIds.length >= totalInBatch;
  const progressPercent = totalInBatch > 0 ? (masteredIds.length / totalInBatch) * 100 : 0;

  const activePhonetic = useMemo(() => {
    if (!currentCard) return '';
    if (settings.accent === 'uk') return currentCard.phoneticUk || currentCard.phonetic || '';
    return currentCard.phoneticUs || currentCard.phonetic || '';
  }, [currentCard, settings.accent]);

  const currentCardMastery = useMemo(() => {
    if (!currentCard) return 1;
    return (currentCard.id.charCodeAt(0) % 5) + 1;
  }, [currentCard]);

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

  useEffect(() => {
    if (!isOpen || isFinished || !currentCard || !settings.autoPlayAudio) return;
    const timer = setTimeout(() => { handlePlayAudio(); }, 250);
    return () => clearTimeout(timer);
  }, [currentCard, isOpen, isFinished, settings.autoPlayAudio, handlePlayAudio]);

  const handleFlip = useCallback(() => setIsFlipped((prev) => !prev), []);

  const handleReview = useCallback(async () => {
    if (!currentCard || reviewMutation.isPending) return;
    try {
      await reviewMutation.mutateAsync({ flashcardId: currentCard.id, quality: 1 });
      setReviewCount((prev) => prev + 1);
      setIsFlipped(false);
      setQueue((prev) => [...prev.slice(1), currentCard]);
    } catch (error) {
      console.error('Failed to review flashcard:', error);
    }
  }, [currentCard, reviewMutation]);

  const handleGotIt = useCallback(async () => {
    if (!currentCard || reviewMutation.isPending) return;
    try {
      await reviewMutation.mutateAsync({ flashcardId: currentCard.id, quality: 3 });
      setGotItCount((prev) => prev + 1);
      setMasteredIds((prev) => prev.includes(currentCard.id) ? prev : [...prev, currentCard.id]);
      setIsFlipped(false);
      setQueue((prev) => prev.slice(1));
    } catch (error) {
      console.error('Failed to review flashcard:', error);
    }
  }, [currentCard, reviewMutation]);

  const handleRestart = useCallback(() => {
    setQueue(initialBatch);
    setMasteredIds([]);
    setReviewCount(0);
    setGotItCount(0);
    setIsFlipped(false);
  }, [initialBatch]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      if (event.key === 'Escape') { event.preventDefault(); onClose(); return; }
      if (isFinished) return;
      if (event.key === ' ' || event.key === 'Enter') {
        if (!canFlipRef.current || event.repeat) return;
        event.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (event.key === '1' || event.key === 'ArrowLeft') {
        event.preventDefault(); handleReview();
      } else if (event.key === '2' || event.key === 'ArrowRight') {
        event.preventDefault(); handleGotIt();
      } else if (event.key.toLowerCase() === 'a') {
        event.preventDefault(); handlePlayAudio();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFinished, handleReview, handleGotIt, handlePlayAudio, onClose]);

  return {
    queue,
    masteredIds,
    reviewCount,
    gotItCount,
    isFlipped,
    currentCard,
    totalInBatch,
    isFinished,
    progressPercent,
    activePhonetic,
    currentCardMastery,
    canFlipRef,
    isSubmitting: reviewMutation.isPending,
    playingAccent,
    isPlaying,
    settings,
    handleFlip,
    handleReview,
    handleGotIt,
    handleRestart,
    handlePlayUsAudio,
    handlePlayUkAudio,
    handlePlayAudio,
  };
}
