'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { StudySessionMode } from '@/features/study/types/study.types';
import type { StudyViewData } from '@/features/study/components/study-view';
import type { Folder, VocabularyWord } from '@/services/vocabulary';
import type { DueFlashcard } from '@/services/study';

interface UseFolderStudyActionsProps {
  activeFolder: Folder | null;
  flashcards?: VocabularyWord[];
  dueFlashcardsData?: DueFlashcard[];
  presentStudyView: (data: StudyViewData) => void;
}

export function useFolderStudyActions({
  activeFolder,
  flashcards = [],
  dueFlashcardsData = [],
  presentStudyView,
}: UseFolderStudyActionsProps) {
  const t = useTranslations('Vocabulary.Folders');
  const tStudy = useTranslations('Vocabulary.Study');

  const allFlashcards: VocabularyWord[] = useMemo(
    () => flashcards,
    [flashcards],
  );

  const { dueIdSet, dueTermSet } = useMemo(() => {
    const now = Date.now();
    const idSet = new Set<string>();
    const termSet = new Set<string>();

    for (const card of dueFlashcardsData) {
      const isPastDue =
        Boolean(card.nextReviewAt) &&
        new Date(card.nextReviewAt as string).getTime() <= now;
      const isDue =
        (isPastDue || Boolean(card.isWilted)) &&
        ((card.level ?? 0) >= 1 || (card.learningStep ?? 0) >= 5);

      if (isDue) {
        if (card.wordId) idSet.add(card.wordId);
        if (card.flashcardId) idSet.add(card.flashcardId);
        if (card.term) termSet.add(card.term.toLowerCase().trim());
      }
    }

    return { dueIdSet: idSet, dueTermSet: termSet };
  }, [dueFlashcardsData]);

  const enrichedFlashcards = useMemo(() => {
    return allFlashcards.map((card) => {
      const termKey = card.term.toLowerCase().trim();
      const isDue =
        dueIdSet.has(card.id) ||
        Boolean(card.wordId && dueIdSet.has(card.wordId)) ||
        Boolean(card.flashcardId && dueIdSet.has(card.flashcardId)) ||
        dueTermSet.has(termKey) ||
        Boolean(card.isWilted);

      return isDue ? { ...card, isWilted: true } : card;
    });
  }, [allFlashcards, dueIdSet, dueTermSet]);

  const dueCardsList: VocabularyWord[] = useMemo(() => {
    return enrichedFlashcards.filter(
      (card) =>
        ((card.level ?? 0) >= 1 || (card.learningStep ?? 0) >= 5) &&
        Boolean(card.isWilted),
    );
  }, [enrichedFlashcards]);

  const learnedCardsList: VocabularyWord[] = useMemo(() => {
    return enrichedFlashcards.filter(
      (card) => (card.level ?? 0) >= 1 || (card.learningStep ?? 0) >= 5,
    );
  }, [enrichedFlashcards]);

  const uniqueFlashcards: VocabularyWord[] = useMemo(() => {
    const seen = new Set<string>();
    const list: VocabularyWord[] = [];
    for (const card of enrichedFlashcards) {
      const termKey = card.term.toLowerCase().trim();
      if (!seen.has(termKey)) {
        seen.add(termKey);
        list.push(card);
      }
    }
    return list;
  }, [enrichedFlashcards]);

  const frequentlyMissedCards = useMemo(() => {
    if (!uniqueFlashcards.length) return [];
    return uniqueFlashcards
      .filter((card) => Boolean(card.isWilted))
      .slice(0, 3);
  }, [uniqueFlashcards]);

  const handlePractice = () => {
    const cardsToStudy = dueCardsList.length > 0 ? dueCardsList : allFlashcards;
    if (!cardsToStudy.length) return;
    presentStudyView({
      cards: cardsToStudy,
      folderName: activeFolder
        ? `${activeFolder.name} - ${tStudy('practice')}`
        : tStudy('practice'),
      isReviewMode: dueCardsList.length > 0,
      mode: StudySessionMode.PRACTICE,
    });
  };

  const handleLearnNew = () => {
    const unlearned = allFlashcards.filter(
      (card) =>
        (card.level ?? 0) === 0 &&
        (card.learningStep ?? 0) === 0 &&
        (card.masteryScore ?? 0) === 0,
    );
    const cardsToStudy = unlearned.length > 0 ? unlearned : allFlashcards;
    if (!cardsToStudy.length) return;

    presentStudyView({
      cards: cardsToStudy,
      folderName: activeFolder
        ? `${activeFolder.name} - ${tStudy('learnNew')}`
        : tStudy('learnNew'),
      mode: StudySessionMode.PRACTICE,
    });
  };

  const handleFlashcards = () => {
    if (!allFlashcards.length) return;
    presentStudyView({
      cards: allFlashcards,
      folderName: activeFolder
        ? `${activeFolder.name} - ${tStudy('flashcards')}`
        : tStudy('flashcards'),
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
