'use client';

import { useCallback, useMemo } from 'react';
import { useTimeout } from '@lumen/hooks';
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

  const delay =
    isOpen &&
    !isFinished &&
    currentCard &&
    autoPlayAudio &&
    (exerciseType === StudyExerciseType.FLASHCARD ||
      exerciseType === StudyExerciseType.CHOICE_MEANING)
      ? 250
      : null;

  useTimeout(handlePlayAudio, delay);

  return {
    activePhonetic,
    isPlaying,
    playingAccent,
    handlePlayUsAudio,
    handlePlayUkAudio,
    handlePlayAudio,
  };
}
