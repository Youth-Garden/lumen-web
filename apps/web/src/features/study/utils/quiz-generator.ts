import { type VocabularyWord } from '@/services/vocabulary';
import {
  StudyExerciseType,
  type ChoiceOption,
  type StudyQueueItem,
} from '@/features/study/types/study.types';

export function getCardPrimaryDefinition(card: VocabularyWord): {
  meaning: string;
  partOfSpeech: string;
} {
  const primaryDef = card.definitions?.[0];
  const meaning =
    primaryDef?.definition?.vi ||
    primaryDef?.translationVi ||
    primaryDef?.definitionEn ||
    primaryDef?.definition?.en ||
    card.term;

  let partOfSpeech = primaryDef?.partOfSpeech?.trim() || '';
  if (partOfSpeech) {
    const normalized = partOfSpeech.toLowerCase().replace(/\.$/, '');
    if (normalized === 'n' || normalized === 'noun') partOfSpeech = 'noun';
    else if (normalized === 'v' || normalized === 'verb') partOfSpeech = 'verb';
    else if (normalized === 'adj' || normalized === 'adjective')
      partOfSpeech = 'adjective';
    else if (normalized === 'adv' || normalized === 'adverb')
      partOfSpeech = 'adverb';
    else if (normalized === 'prep' || normalized === 'preposition')
      partOfSpeech = 'preposition';
  }

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

export function createChoiceTermQuestion(
  card: VocabularyWord,
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

  if (distractors.length < 3) {
    return createTypingQuestion(card, isReviewingFailed);
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
  };
}

export function createChoiceMeaningQuestion(
  card: VocabularyWord,
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

  if (distractors.length < 3) {
    return createTypingQuestion(card, isReviewingFailed);
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
  };
}

export function createTypingQuestion(
  card: VocabularyWord,
  isReviewingFailed = false,
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
  };
}

export function createNextExerciseForWord(
  card: VocabularyWord,
  pool: VocabularyWord[],
  fallbackPool: VocabularyWord[] = [],
  globalPool: VocabularyWord[] = [],
  previousExerciseType?: StudyExerciseType,
  isReviewingFailed = false,
): StudyQueueItem {
  const distractors = selectDistractorCards(
    card,
    pool,
    fallbackPool,
    globalPool,
    3,
  );

  if (distractors.length < 3) {
    return createTypingQuestion(card, isReviewingFailed);
  }

  let nextExerciseType = StudyExerciseType.CHOICE_TERM;

  if (previousExerciseType === StudyExerciseType.CHOICE_TERM) {
    nextExerciseType = StudyExerciseType.CHOICE_MEANING;
  } else if (previousExerciseType === StudyExerciseType.CHOICE_MEANING) {
    nextExerciseType = StudyExerciseType.TYPING;
  } else if (previousExerciseType === StudyExerciseType.TYPING) {
    nextExerciseType = StudyExerciseType.CHOICE_TERM;
  } else {
    nextExerciseType =
      Math.random() > 0.5
        ? StudyExerciseType.CHOICE_TERM
        : StudyExerciseType.CHOICE_MEANING;
  }

  if (nextExerciseType === StudyExerciseType.CHOICE_TERM) {
    return createChoiceTermQuestion(
      card,
      pool,
      fallbackPool,
      globalPool,
      isReviewingFailed,
    );
  }
  if (nextExerciseType === StudyExerciseType.CHOICE_MEANING) {
    return createChoiceMeaningQuestion(
      card,
      pool,
      fallbackPool,
      globalPool,
      isReviewingFailed,
    );
  }
  return createTypingQuestion(card, isReviewingFailed);
}
