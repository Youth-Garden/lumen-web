'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { usePronunciation } from '@/shared/hooks';
import {
  PronunciationAccent,
  type VocabularyWord,
} from '@/services/vocabulary';
import { StudyExerciseType } from '@/features/study/types/study.types';

export interface UseStudyAudioProps {
  currentCard: VocabularyWord | null;
  exerciseType?: StudyExerciseType;
  autoPlayAudio: boolean;
  accent: string;
  isOpen: boolean;
  isFinished: boolean;
}

export function useStudyAudio({
  currentCard,
  exerciseType,
  autoPlayAudio,
  accent,
  isOpen,
  isFinished,
}: UseStudyAudioProps) {
  const { playPronunciation, isPlaying, playingAccent } = usePronunciation();

  const activePhonetic = useMemo(() => {
    if (!currentCard) return '';
    if (accent === PronunciationAccent.UK && currentCard.phoneticUk) {
      return currentCard.phoneticUk;
    }
    return currentCard.phoneticUs || currentCard.phonetic || '';
  }, [currentCard, accent]);

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
    if (accent === 'uk') handlePlayUkAudio();
    else handlePlayUsAudio();
  }, [accent, handlePlayUkAudio, handlePlayUsAudio]);

  useEffect(() => {
    if (!isOpen || isFinished || !currentCard || !autoPlayAudio) return;
    if (
      exerciseType === StudyExerciseType.FLASHCARD ||
      exerciseType === StudyExerciseType.CHOICE_MEANING
    ) {
      const timer = setTimeout(() => {
        handlePlayAudio();
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [
    currentCard,
    exerciseType,
    isOpen,
    isFinished,
    autoPlayAudio,
    handlePlayAudio,
  ]);

  return {
    activePhonetic,
    isPlaying,
    playingAccent,
    handlePlayUsAudio,
    handlePlayUkAudio,
    handlePlayAudio,
  };
}
