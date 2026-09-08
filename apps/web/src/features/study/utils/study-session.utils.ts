import {
  StudyExerciseType,
  StudyQueueItem,
  type MissedWordStat,
} from '@/features/study/types/study.types';
import { createNextExerciseForWord } from './quiz-generator';
import { FlashcardRating, type CardWithProgress } from '@/services/study';
import { type VocabularyWord } from '@/services/vocabulary';

export function filterPoolCards(
  cards: VocabularyWord[],
  selectedTopic?: string,
  count = 20,
  defaultTopicName = 'Chung',
): VocabularyWord[] {
  let list = cards;
  if (selectedTopic) {
    list = cards.filter((card) => {
      const top = card.topic?.trim() || defaultTopicName;
      return top === selectedTopic;
    });
  }
  return list.slice(0, count);
}

export function createInitialStudyQueue(
  poolCards: VocabularyWord[],
): StudyQueueItem[] {
  return poolCards.map((card) => {
    const cardWithProg = card as CardWithProgress;
    const isBrandNew = (cardWithProg.level ?? 0) === 0;

    if (isBrandNew) {
      return {
        id: 'flashcard_' + card.id + '_' + Date.now() + '_' + Math.random(),
        card,
        exerciseType: StudyExerciseType.FLASHCARD,
      };
    }

    return createNextExerciseForWord(card, poolCards, undefined, false);
  });
}

export function insertNextExerciseInQueue(
  queue: StudyQueueItem[],
  nextExercise: StudyQueueItem,
): StudyQueueItem[] {
  const remaining = queue.slice(1);
  if (remaining.length > 2) {
    const insertIdx = Math.min(remaining.length, 3);
    return [
      ...remaining.slice(0, insertIdx),
      nextExercise,
      ...remaining.slice(insertIdx),
    ];
  }
  return [...remaining, nextExercise];
}

export function calculateProgressPercent(
  masteredCount: number,
  totalCount: number,
): number {
  return totalCount > 0 ? (masteredCount / totalCount) * 100 : 0;
}

export function determineFlashcardQuality(
  rating: FlashcardRating,
): FlashcardRating {
  if (rating === FlashcardRating.WRONG) return FlashcardRating.WRONG;
  if (rating === FlashcardRating.FAST_TRACK_KNOWN)
    return FlashcardRating.FAST_TRACK_KNOWN;
  if (rating === FlashcardRating.FAST_TRACK_TEMP)
    return FlashcardRating.FAST_TRACK_TEMP;
  return FlashcardRating.CORRECT;
}

export function sortMissedWords(
  missedMap: Record<string, MissedWordStat>,
): MissedWordStat[] {
  return Object.values(missedMap).sort(
    (firstStat, secondStat) => secondStat.errorCount - firstStat.errorCount,
  );
}
