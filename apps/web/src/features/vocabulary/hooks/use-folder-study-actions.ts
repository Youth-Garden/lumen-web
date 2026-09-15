'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { StudySessionMode } from '@/features/study/types/study.types';
import type { StudyViewData } from '@/features/study/components/study-view';
import type { Folder, VocabularyWord } from '@/services/vocabulary';
import type { DueFlashcard } from '@/services/study';

interface UseFolderStudyActionsProps {
  activeFolder: Folder | null;
  activeFolderDetail?: Folder | null;
  dueFlashcardsData?: DueFlashcard[];
  presentStudyView: (data: StudyViewData) => void;
}

export function useFolderStudyActions({
  activeFolder,
  activeFolderDetail,
  dueFlashcardsData = [],
  presentStudyView,
}: UseFolderStudyActionsProps) {
  const t = useTranslations('Vocabulary.Folders');
  const tStudy = useTranslations('Vocabulary.Study');

  const allFlashcards: VocabularyWord[] = useMemo(
    () => activeFolderDetail?.flashcards || [],
    [activeFolderDetail?.flashcards],
  );

  const dueIdSet = useMemo(() => {
    return new Set(
      dueFlashcardsData
        .filter(
          (card) =>
            Boolean(card.nextReviewAt) ||
            (card.level ?? 0) > 0 ||
            (card.learningStep ?? 0) > 0,
        )
        .flatMap((dueFlashcard) => [
          dueFlashcard.wordId,
          dueFlashcard.flashcardId,
        ]),
    );
  }, [dueFlashcardsData]);

  const dueCardsList: VocabularyWord[] = useMemo(() => {
    return allFlashcards.filter(
      (card) =>
        dueIdSet.has(card.id) ||
        Boolean(card.wordId && dueIdSet.has(card.wordId)) ||
        Boolean(card.flashcardId && dueIdSet.has(card.flashcardId)),
    );
  }, [allFlashcards, dueIdSet]);

  const learnedCardsList: VocabularyWord[] = useMemo(() => {
    return allFlashcards.filter(
      (card) =>
        (card.level ?? 0) > 0 ||
        (card.learningStep ?? 0) > 0 ||
        (card.masteryScore ?? 0) > 0,
    );
  }, [allFlashcards]);

  const uniqueFlashcards: VocabularyWord[] = useMemo(() => {
    const seen = new Set<string>();
    const list: VocabularyWord[] = [];
    for (const card of allFlashcards) {
      const termKey = card.term.toLowerCase().trim();
      if (!seen.has(termKey)) {
        seen.add(termKey);
        list.push(card);
      }
    }
    return list;
  }, [allFlashcards]);

  const frequentlyMissedCards = useMemo(() => {
    if (!uniqueFlashcards.length) return [];
    return uniqueFlashcards
      .filter((card) => Boolean(card.isWilted))
      .slice(0, 3);
  }, [uniqueFlashcards]);

  const handlePractice = () => {
    if (!activeFolder) return;
    const cardsToStudy = dueCardsList.length > 0 ? dueCardsList : allFlashcards;
    if (!cardsToStudy.length) return;
    presentStudyView({
      cards: cardsToStudy,
      folderName: `${activeFolder.name} - ${tStudy('practice')}`,
      isReviewMode: dueCardsList.length > 0,
      mode: StudySessionMode.PRACTICE,
    });
  };

  const handleLearnNew = () => {
    if (!activeFolder) return;
    const cardsToStudy =
      allFlashcards.filter(
        (card) =>
          (card.level ?? 0) === 0 &&
          (card.learningStep ?? 0) === 0 &&
          (card.masteryScore ?? 0) === 0,
      ) || allFlashcards;

    presentStudyView({
      cards: cardsToStudy.length > 0 ? cardsToStudy : allFlashcards,
      folderName: `${activeFolder.name} - ${tStudy('learnNew')}`,
      mode: StudySessionMode.PRACTICE,
    });
  };

  const handleFlashcards = () => {
    if (!activeFolder || !allFlashcards.length) return;
    presentStudyView({
      cards: allFlashcards,
      folderName: `${activeFolder.name} - ${tStudy('flashcards')}`,
      mode: StudySessionMode.FLASHCARD,
    });
  };

  const handlePracticeMissed = () => {
    if (!frequentlyMissedCards.length) return;
    presentStudyView({
      cards: frequentlyMissedCards,
      folderName: `${t('frequentlyMissedTitle')} - ${tStudy('practice')}`,
      isReviewMode: true,
      mode: StudySessionMode.PRACTICE,
    });
  };

  const handleFlashcardsMissed = () => {
    if (!frequentlyMissedCards.length) return;
    presentStudyView({
      cards: frequentlyMissedCards,
      folderName: `${t('frequentlyMissedTitle')} - ${tStudy('flashcards')}`,
      mode: StudySessionMode.FLASHCARD,
    });
  };

  return {
    allFlashcards,
    dueCardsList,
    learnedCardsList,
    frequentlyMissedCards,
    handlePractice,
    handleLearnNew,
    handleFlashcards,
    handlePracticeMissed,
    handleFlashcardsMissed,
  };
}
