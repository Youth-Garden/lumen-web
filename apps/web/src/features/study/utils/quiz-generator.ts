import { type VocabularyWord } from '@/services/vocabulary';
import {
  StudyExerciseType,
  type ChoiceOption,
  type StudyQueueItem,
} from '@/features/study/types/study.types';
import { Locale } from '@/shared/types';
import { i18nText, normalizePartOfSpeech } from '@/shared/utils';

export function getCardPrimaryDefinition(
  card: VocabularyWord,
  locale: Locale = Locale.EN,
): {
  meaning: string;
  partOfSpeech: string;
} {
  const primaryDef = card.definitions?.[0];
  const meaning = i18nText(primaryDef?.definition, locale) || card.term;
  const partOfSpeech = normalizePartOfSpeech(primaryDef?.partOfSpeech);

  return { meaning, partOfSpeech };
}

function shuffleArray<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const temp = shuffled[index];
    shuffled[index] = shuffled[randomIndex];
    shuffled[randomIndex] = temp;
  }
  return shuffled;
}

export function selectDistractorCards(
  card: VocabularyWord,
  pool: VocabularyWord[],
  fallbackPool: VocabularyWord[] = [],
  globalPool: VocabularyWord[] = [],
  neededCount = 3,
): VocabularyWord[] {
  const selected: VocabularyWord[] = [];
  const selectedIds = new Set<string>([card.id]);
  const selectedTerms = new Set<string>([card.term.toLowerCase().trim()]);

  const drainFromPool = (candidatePool: VocabularyWord[]) => {
    if (selected.length >= neededCount || !candidatePool.length) return;

    const candidates = shuffleArray(
      candidatePool.filter(
        (candidateCard) =>
          candidateCard.id !== card.id &&
          candidateCard.term.toLowerCase().trim() !==
            card.term.toLowerCase().trim(),
      ),
    );

    for (const candidate of candidates) {
      if (selected.length >= neededCount) break;
      const termKey = candidate.term.toLowerCase().trim();
      if (!selectedIds.has(candidate.id) && !selectedTerms.has(termKey)) {
        selected.push(candidate);
        selectedIds.add(candidate.id);
        selectedTerms.add(termKey);
      }
    }
  };

  // Priority 1: Pick from same Topic / Batch pool
  drainFromPool(pool);

  // Priority 2: Pick from same Folder fallback pool if needed
  drainFromPool(fallbackPool);

  // Priority 3: Pick from system-wide global vocabulary pool if needed
  drainFromPool(globalPool);

  return selected;
}

export function createFlashcardItem(
  card: VocabularyWord,
  stepIndex = 0,
  totalSteps = 3,
): StudyQueueItem {
  return {
    id:
      'flashcard_' +
      card.id +
      '_' +
      Date.now() +
      '_' +
      Math.random().toString(36).substring(2, 6),
    card,
    exerciseType: StudyExerciseType.FLASHCARD,
    stepIndex,
    totalSteps,
  };
}

export function createChoiceTermQuestion(
  card: VocabularyWord,
  pool: VocabularyWord[],
  fallbackPool: VocabularyWord[] = [],
  globalPool: VocabularyWord[] = [],
  isReviewingFailed = false,
  stepIndex = 1,
  totalSteps = 3,
): StudyQueueItem {
  const distractors = selectDistractorCards(
    card,
    pool,
    fallbackPool,
    globalPool,
    3,
  );

  if (distractors.length < 3) {
    return createTypingQuestion(card, isReviewingFailed, 2, totalSteps);
  }

  const { meaning, partOfSpeech } = getCardPrimaryDefinition(card);

  const correctOption: ChoiceOption = {
    id: card.id,
    label: card.term,
    isCorrect: true,
  };

  const distractorOptions: ChoiceOption[] = distractors.map(
    (distractorCard) => ({
      id: distractorCard.id,
      label: distractorCard.term,
      isCorrect: false,
    }),
  );

  const options = shuffleArray([correctOption, ...distractorOptions]);

  return {
    id:
      'choice_term_' +
      card.id +
      '_' +
      Date.now() +
      '_' +
      Math.random().toString(36).substring(2, 6),
    card,
    exerciseType: StudyExerciseType.CHOICE_TERM,
    meaningPrompt: meaning,
    partOfSpeechPrompt: partOfSpeech,
    options,
    isReviewingFailed,
    stepIndex,
    totalSteps,
  };
}

export function createChoiceMeaningQuestion(
  card: VocabularyWord,
  pool: VocabularyWord[],
  fallbackPool: VocabularyWord[] = [],
  globalPool: VocabularyWord[] = [],
  isReviewingFailed = false,
  stepIndex = 1,
  totalSteps = 3,
): StudyQueueItem {
  const distractors = selectDistractorCards(
    card,
    pool,
    fallbackPool,
    globalPool,
    3,
  );

  if (distractors.length < 3) {
    return createTypingQuestion(card, isReviewingFailed, 2, totalSteps);
  }

  const primary = getCardPrimaryDefinition(card);

  const correctOption: ChoiceOption = {
    id: card.id,
    label: primary.meaning,
    subLabel: primary.partOfSpeech
      ? '(' + primary.partOfSpeech + ')'
      : undefined,
    isCorrect: true,
  };

  const distractorOptions: ChoiceOption[] = distractors.map(
    (distractorCard) => {
      const definition = getCardPrimaryDefinition(distractorCard);
      return {
        id: distractorCard.id,
        label: definition.meaning,
        subLabel: definition.partOfSpeech
          ? '(' + definition.partOfSpeech + ')'
          : undefined,
        isCorrect: false,
      };
    },
  );

  const options = shuffleArray([correctOption, ...distractorOptions]);

  return {
    id:
      'choice_meaning_' +
      card.id +
      '_' +
      Date.now() +
      '_' +
      Math.random().toString(36).substring(2, 6),
    card,
    exerciseType: StudyExerciseType.CHOICE_MEANING,
    meaningPrompt: primary.meaning,
    partOfSpeechPrompt: primary.partOfSpeech,
    options,
    isReviewingFailed,
    stepIndex,
    totalSteps,
  };
}

export function createTypingQuestion(
  card: VocabularyWord,
  isReviewingFailed = false,
  stepIndex = 2,
  totalSteps = 3,
): StudyQueueItem {
  const { meaning, partOfSpeech } = getCardPrimaryDefinition(card);

  return {
    id:
      'typing_' +
      card.id +
      '_' +
      Date.now() +
      '_' +
      Math.random().toString(36).substring(2, 6),
    card,
    exerciseType: StudyExerciseType.TYPING,
    meaningPrompt: meaning,
    partOfSpeechPrompt: partOfSpeech,
    isReviewingFailed,
    stepIndex,
    totalSteps,
  };
}

export function createProgressionExercise(
  card: VocabularyWord,
  targetStep: number,
  pool: VocabularyWord[],
  fallbackPool: VocabularyWord[] = [],
  globalPool: VocabularyWord[] = [],
  isReviewingFailed = false,
): StudyQueueItem {
  const distractors = selectDistractorCards(
    card,
    pool,
    fallbackPool,
    globalPool,
    3,
  );
  const hasEnoughDistractors = distractors.length >= 3;

  if (targetStep <= 1) {
    if (!hasEnoughDistractors) {
      return createTypingQuestion(card, isReviewingFailed, 2, 3);
    }
    return Math.random() > 0.5
      ? createChoiceTermQuestion(
          card,
          pool,
          fallbackPool,
          globalPool,
          isReviewingFailed,
          1,
          3,
        )
      : createChoiceMeaningQuestion(
          card,
          pool,
          fallbackPool,
          globalPool,
          isReviewingFailed,
          1,
          3,
        );
  }

  return createTypingQuestion(card, isReviewingFailed, 2, 3);
}

export function createNextExerciseForWord(
  card: VocabularyWord,
  pool: VocabularyWord[],
  fallbackPool: VocabularyWord[] = [],
  globalPool: VocabularyWord[] = [],
  previousExerciseType?: StudyExerciseType,
  isReviewingFailed = false,
): StudyQueueItem {
  if (previousExerciseType === StudyExerciseType.FLASHCARD) {
    return createProgressionExercise(
      card,
      1,
      pool,
      fallbackPool,
      globalPool,
      isReviewingFailed,
    );
  }
  if (
    previousExerciseType === StudyExerciseType.CHOICE_TERM ||
    previousExerciseType === StudyExerciseType.CHOICE_MEANING
  ) {
    return createTypingQuestion(card, isReviewingFailed, 2, 3);
  }
  return createProgressionExercise(
    card,
    1,
    pool,
    fallbackPool,
    globalPool,
    isReviewingFailed,
  );
}
