import {
  StudyExerciseType,
  StudyFeedbackState,
  StudyQueueItem,
  StudySessionMode,
  type MissedWordStat,
} from '@/features/study/types/study.types';
import {
  createNextExerciseForWord,
  getCardPrimaryDefinition,
} from './quiz-generator';
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
  mode: StudySessionMode = StudySessionMode.LEARN_NEW,
): StudyQueueItem[] {
  return poolCards.map((card) => {
    if (mode === StudySessionMode.FLASHCARD) {
      return {
        id: `flashcard_${card.id}_${Date.now()}_${Math.random()}`,
        card,
        exerciseType: StudyExerciseType.FLASHCARD,
      };
    }

    if (mode === StudySessionMode.PRACTICE) {
      return createNextExerciseForWord(card, poolCards, undefined, false);
    }

    const cardWithProg = card as CardWithProgress;
    const isBrandNew =
      (cardWithProg.level ?? 0) === 0 && (cardWithProg.learningStep ?? 0) === 0;

    if (isBrandNew) {
      return {
        id: `flashcard_${card.id}_${Date.now()}_${Math.random()}`,
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

export function calculateNewFlashcardProgress(
  rating: FlashcardRating,
  currentLevel: number,
  currentStep: number,
): { newLevel: number; newLearningStep: number; isMastered: boolean } {
  if (rating === FlashcardRating.FAST_TRACK_KNOWN) {
    return { newLevel: 5, newLearningStep: 5, isMastered: true };
  }
  if (rating === FlashcardRating.FAST_TRACK_TEMP) {
    return { newLevel: 2, newLearningStep: 0, isMastered: false };
  }
  if (rating === FlashcardRating.WRONG) {
    const penalizedLevel = Math.max(0, currentLevel - 1);
    return { newLevel: penalizedLevel, newLearningStep: penalizedLevel === 0 ? 0 : 1, isMastered: false };
  }
  return {
    newLevel: currentLevel,
    newLearningStep: Math.min(5, currentStep + 1),
    isMastered: false,
  };
}

export function calculateNextProgressOnAnswer(
  isCorrect: boolean,
  currentLevel: number,
  currentStep: number,
): { level: number; learningStep: number } {
  if (isCorrect) {
    return {
      level: currentLevel,
      learningStep: Math.min(5, currentStep + 1),
    };
  }
  // Mirror backend: WRONG_ANSWER_SCORE_PENALTY = SCORE_PER_LEVEL = 20 → drop 1 level
  const penalizedLevel = Math.max(0, currentLevel - 1);
  return {
    level: penalizedLevel,
    learningStep: penalizedLevel === 0 ? 0 : 1,
  };
}

export function saveStudyProgressToStorage(
  storageKey: string,
  activeQueue: StudyQueueItem[],
  masteredIds: string[],
  missedWordsMap: Record<string, MissedWordStat>,
): boolean {
  try {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        activeQueueIds: activeQueue.map((item) => item.card.id),
        masteredIds,
        missedWordsMap,
        updatedAt: Date.now(),
      }),
    );
    return true;
  } catch (err) {
    console.error('Failed to save study progress:', err);
    return false;
  }
}

export function buildFeedbackState(
  currentCard: VocabularyWord,
  isCorrect: boolean,
  userAnswer?: string,
): StudyFeedbackState {
  const { meaning, partOfSpeech } = getCardPrimaryDefinition(currentCard);
  return {
    isOpen: true,
    isCorrect,
    card: currentCard,
    userAnswer,
    correctAnswer: currentCard.term,
    meaning,
    partOfSpeech,
    imageUrl: currentCard.imageUrl,
  };
}

export function getNextQueueAfterFeedback(
  activeQueue: StudyQueueItem[],
  currentCard: VocabularyWord,
  exerciseType: StudyExerciseType,
  poolCards: VocabularyWord[],
  wasCorrect: boolean,
): StudyQueueItem[] {
  const remaining = activeQueue.slice(1);
  if (wasCorrect) return remaining;
  const retry = createNextExerciseForWord(
    currentCard,
    poolCards,
    exerciseType,
    true,
  );
  return [...remaining, retry];
}

export function getCurrentCardMastery(
  card: VocabularyWord | null,
  progressMap: Record<string, { level: number; learningStep: number }>,
): number {
  if (!card) return 0;
  return progressMap[card.id]?.level ?? (card as CardWithProgress).level ?? 0;
}

export function getCurrentCardLearningStep(
  card: VocabularyWord | null,
  progressMap: Record<string, { level: number; learningStep: number }>,
): number {
  if (!card) return 0;
  return (
    progressMap[card.id]?.learningStep ??
    (card as CardWithProgress).learningStep ??
    0
  );
}

export function calculateFlashcardReviewProgress(
  currentLevel: number,
  currentStep: number,
  isKnown: boolean,
): { newLevel: number; newLearningStep: number } {
  if (isKnown) {
    if (currentStep >= 5) {
      return {
        newLevel: Math.min(5, currentLevel + 1),
        newLearningStep: 1,
      };
    }
    return {
      newLevel: Math.max(1, currentLevel),
      newLearningStep: currentStep + 1,
    };
  }

  return {
    newLevel: currentStep <= 1 ? Math.max(0, currentLevel - 1) : currentLevel,
    newLearningStep: Math.max(0, currentStep - 1),
  };
}

export function processFlashcardReviewStep(
  currentCard: VocabularyWord,
  isKnown: boolean,
  currentLevel: number,
  currentStep: number,
  activeQueue: StudyQueueItem[],
): {
  newLevel: number;
  newLearningStep: number;
  nextQueue: StudyQueueItem[];
  isMastered: boolean;
} {
  const { newLevel, newLearningStep } = calculateFlashcardReviewProgress(
    currentLevel,
    currentStep,
    isKnown,
  );
  const remaining = activeQueue.slice(1);
  const nextQueue = isKnown ? remaining : [...remaining, activeQueue[0]];
  return { newLevel, newLearningStep, nextQueue, isMastered: isKnown };
}

export function processAdvanceFromFlashcard(
  rating: FlashcardRating,
  currentLevel: number,
  currentStep: number,
  currentCard: VocabularyWord,
  poolCards: VocabularyWord[],
  activeQueue: StudyQueueItem[],
): {
  newLevel: number;
  newLearningStep: number;
  isMastered: boolean;
  nextQueue: StudyQueueItem[];
} {
  const { newLevel, newLearningStep, isMastered } =
    calculateNewFlashcardProgress(rating, currentLevel, currentStep);
  const updatedCard = {
    ...currentCard,
    level: newLevel,
    learningStep: newLearningStep,
  };
  const nextExercise = createNextExerciseForWord(
    updatedCard,
    poolCards,
    StudyExerciseType.FLASHCARD,
    false,
  );
  const nextQueue = insertNextExerciseInQueue(activeQueue, nextExercise);
  return { newLevel, newLearningStep, isMastered, nextQueue };
}





