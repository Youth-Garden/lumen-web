import {
  StudyExerciseType,
  StudyFeedbackState,
  StudyQueueItem,
  StudySessionMode,
  type MissedWordStat,
} from '@/features/study/types/study.types';
import {
  createFlashcardItem,
  createProgressionExercise,
  getCardPrimaryDefinition,
} from './quiz-generator';
import { FlashcardRating } from '@/services/study';
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

export function resolveStudyPool(
  cards: VocabularyWord[],
  selectedTopic: string | null | undefined,
  mode: StudySessionMode = StudySessionMode.LEARN_NEW,
  newWordsCount = 5,
  targetCount = 20,
  defaultTopicName = 'Chung',
): VocabularyWord[] {
  let scopedCards = cards;
  if (selectedTopic) {
    scopedCards = cards.filter((card) => {
      const top = card.topic?.trim() || defaultTopicName;
      return top === selectedTopic;
    });
  }

  if (mode === StudySessionMode.FLASHCARD) {
    return scopedCards.slice(0, targetCount);
  }

  if (mode === StudySessionMode.PRACTICE) {
    const dueOrLearned = scopedCards.filter(
      (c) =>
        (c.level ?? 0) >= 1 ||
        (c.learningStep ?? 0) >= 1 ||
        Boolean(c.isWilted),
    );
    const pool = dueOrLearned.length > 0 ? dueOrLearned : scopedCards;
    return pool.slice(0, targetCount);
  }

  const unlearnedCards = scopedCards.filter(
    (c) =>
      (c.level ?? 0) === 0 &&
      (c.learningStep ?? 0) === 0 &&
      (c.masteryScore ?? 0) === 0,
  );
  const reviewCards = scopedCards.filter(
    (c) =>
      (c.level ?? 0) > 0 ||
      (c.learningStep ?? 0) > 0 ||
      (c.masteryScore ?? 0) > 0 ||
      Boolean(c.isWilted),
  );

  let orderedUnlearned = unlearnedCards;
  if (!selectedTopic && unlearnedCards.length > 0) {
    const topicMap = new Map<string, VocabularyWord[]>();
    for (const card of unlearnedCards) {
      const top = card.topic?.trim() || defaultTopicName;
      if (!topicMap.has(top)) topicMap.set(top, []);
      topicMap.get(top)!.push(card);
    }
    orderedUnlearned = Array.from(topicMap.values()).flat();
  }

  const selectedNew = orderedUnlearned.slice(0, newWordsCount);
  const remainingSlots = Math.max(0, targetCount - selectedNew.length);
  const selectedReview = reviewCards.slice(0, remainingSlots);

  return [...selectedNew, ...selectedReview];
}

export function calculateTargetSessionPoints(
  poolCards: VocabularyWord[],
  mode: StudySessionMode = StudySessionMode.LEARN_NEW,
): number {
  if (poolCards.length === 0) return 1;
  if (mode === StudySessionMode.FLASHCARD) {
    return Math.max(1, poolCards.length * 1.0);
  }
  if (mode === StudySessionMode.PRACTICE) {
    return Math.max(1, poolCards.length * 2.0);
  }
  return Math.max(1, poolCards.length * 3.0);
}

export function calculateCumulativeProgressPercent(
  earnedPoints: number,
  targetPoints: number,
  isFinished: boolean,
): number {
  if (isFinished) return 100;
  if (targetPoints <= 0) return 0;
  return Math.min(
    99,
    Math.max(0, Math.round((earnedPoints / targetPoints) * 100)),
  );
}

export function createInitialStudyQueue(
  poolCards: VocabularyWord[],
  mode: StudySessionMode = StudySessionMode.LEARN_NEW,
  fallbackPool: VocabularyWord[] = [],
  globalPool: VocabularyWord[] = [],
): StudyQueueItem[] {
  if (mode === StudySessionMode.FLASHCARD) {
    return poolCards.map((card) => createFlashcardItem(card, 0, 1));
  }

  if (mode === StudySessionMode.PRACTICE) {
    return poolCards.map((card) =>
      createProgressionExercise(
        card,
        1,
        poolCards,
        fallbackPool,
        globalPool,
        false,
      ),
    );
  }

  const newCards = poolCards.filter(
    (c) => (c.level ?? 0) === 0 && (c.learningStep ?? 0) === 0,
  );
  const reviewCards = poolCards.filter(
    (c) => (c.level ?? 0) > 0 || (c.learningStep ?? 0) > 0,
  );

  const flashcardItems = newCards.map((card) =>
    createFlashcardItem(card, 0, 3),
  );
  const reviewItems = reviewCards.map((card) =>
    createProgressionExercise(
      card,
      1,
      poolCards,
      fallbackPool,
      globalPool,
      false,
    ),
  );

  return [...flashcardItems, ...reviewItems];
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
    return { newLevel: 6, newLearningStep: 6, isMastered: true };
  }
  if (rating === FlashcardRating.FAST_TRACK_TEMP) {
    return { newLevel: 3, newLearningStep: 3, isMastered: false };
  }
  if (rating === FlashcardRating.WRONG) {
    const penalizedLevel = Math.max(0, currentLevel - 1);
    return {
      newLevel: penalizedLevel,
      newLearningStep: penalizedLevel === 0 ? 0 : 1,
      isMastered: false,
    };
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
  earnedPoints = 0,
): boolean {
  try {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        activeQueueIds: activeQueue.map((item) => item.card.id),
        masteredIds,
        missedWordsMap,
        earnedPoints,
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
  currentItem: StudyQueueItem,
  poolCards: VocabularyWord[],
  wasCorrect: boolean,
  fallbackPool: VocabularyWord[] = [],
  globalPool: VocabularyWord[] = [],
): {
  nextQueue: StudyQueueItem[];
  isMastered: boolean;
  earnedPointsDelta: number;
} {
  const remaining = activeQueue.slice(1);
  const currentStep = currentItem.stepIndex ?? 1;

  if (wasCorrect) {
    if (currentStep === 1) {
      const nextStepExercise = createProgressionExercise(
        currentCard,
        2,
        poolCards,
        fallbackPool,
        globalPool,
        false,
      );
      return {
        nextQueue: insertNextExerciseInQueue(remaining, nextStepExercise),
        isMastered: false,
        earnedPointsDelta: 1.0,
      };
    }
    return {
      nextQueue: remaining,
      isMastered: true,
      earnedPointsDelta: 1.0,
    };
  }

  const retryExercise = createProgressionExercise(
    currentCard,
    currentStep,
    poolCards,
    fallbackPool,
    globalPool,
    true,
  );
  return {
    nextQueue: insertNextExerciseInQueue(remaining, retryExercise),
    isMastered: false,
    earnedPointsDelta: 0.3,
  };
}

export function getCurrentCardMastery(
  card: VocabularyWord | null,
  progressMap: Record<string, { level: number; learningStep: number }>,
): number {
  if (!card) return 0;
  return progressMap[card.id]?.level ?? card.level ?? 0;
}

export function getCurrentCardLearningStep(
  card: VocabularyWord | null,
  progressMap: Record<string, { level: number; learningStep: number }>,
): number {
  if (!card) return 0;
  return progressMap[card.id]?.learningStep ?? card.learningStep ?? 0;
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
  earnedPointsDelta: number;
} {
  const { newLevel, newLearningStep } = calculateFlashcardReviewProgress(
    currentLevel,
    currentStep,
    isKnown,
  );
  const remaining = activeQueue.slice(1);
  const nextQueue = isKnown ? remaining : [...remaining, activeQueue[0]];
  return {
    newLevel,
    newLearningStep,
    nextQueue,
    isMastered: isKnown,
    earnedPointsDelta: isKnown ? 1.0 : 0.3,
  };
}

export function processAdvanceFromFlashcard(
  rating: FlashcardRating,
  currentLevel: number,
  currentStep: number,
  currentCard: VocabularyWord,
  poolCards: VocabularyWord[],
  activeQueue: StudyQueueItem[],
  fallbackPool: VocabularyWord[] = [],
  globalPool: VocabularyWord[] = [],
): {
  newLevel: number;
  newLearningStep: number;
  isMastered: boolean;
  nextQueue: StudyQueueItem[];
  earnedPointsDelta: number;
} {
  const { newLevel, newLearningStep, isMastered } =
    calculateNewFlashcardProgress(rating, currentLevel, currentStep);
  const updatedCard = {
    ...currentCard,
    level: newLevel,
    learningStep: newLearningStep,
  };

  if (isMastered || rating === FlashcardRating.FAST_TRACK_TEMP) {
    return {
      newLevel,
      newLearningStep,
      isMastered,
      nextQueue: activeQueue.slice(1),
      earnedPointsDelta: isMastered ? 3.0 : 1.5,
    };
  }

  const nextExercise = createProgressionExercise(
    updatedCard,
    1,
    poolCards,
    fallbackPool,
    globalPool,
    false,
  );
  const nextQueue = insertNextExerciseInQueue(activeQueue, nextExercise);
  return {
    newLevel,
    newLearningStep,
    isMastered,
    nextQueue,
    earnedPointsDelta: 1.0,
  };
}

export function recordMissedWordItem(
  prevMap: Record<string, MissedWordStat>,
  card: VocabularyWord,
): Record<string, MissedWordStat> {
  const key = card.term.trim().toLowerCase() || card.id;
  return {
    ...prevMap,
    [key]: { card, errorCount: (prevMap[key]?.errorCount || 0) + 1 },
  };
}

export function updateCardProgressMap(
  prevMap: Record<string, { level: number; learningStep: number }>,
  cardId: string,
  level: number,
  learningStep: number,
): Record<string, { level: number; learningStep: number }> {
  return {
    ...prevMap,
    [cardId]: { level, learningStep },
  };
}

export function updateMasteredWordIds(
  prevIds: string[],
  cardId: string,
): string[] {
  return prevIds.includes(cardId) ? prevIds : [...prevIds, cardId];
}
