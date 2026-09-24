import { describe, it, expect } from 'vitest';
import {
  getCardPrimaryDefinition,
  selectDistractorCards,
  createFlashcardItem,
  createChoiceTermQuestion,
  createChoiceMeaningQuestion,
  createTypingQuestion,
  createProgressionExercise,
  createNextExerciseForWord,
} from '../quiz-generator';
import { StudyExerciseType } from '@/features/study/types/study.types';
import { Locale } from '@/shared/types';
import type { VocabularyWord } from '@/services/vocabulary';

const createMockWord = (
  id: string,
  term: string,
  meaning = `${term} meaning`,
  partOfSpeech = 'noun',
): VocabularyWord => ({
  id,
  term,
  definitions: [
    {
      id: `def-${id}`,
      partOfSpeech,
      definition: { en: meaning, vi: meaning },
      examples: [],
    },
  ],
  level: 0,
  learningStep: 0,
  masteryScore: 0,
});

describe('quiz-generator', () => {
  const cardA = createMockWord('1', 'apple', 'quả táo', 'noun');
  const cardB = createMockWord('2', 'banana', 'quả chuối', 'noun');
  const cardC = createMockWord('3', 'orange', 'quả cam', 'noun');
  const cardD = createMockWord('4', 'grape', 'quả nho', 'noun');
  const cardE = createMockWord('5', 'mango', 'quả xoài', 'noun');

  const pool = [cardA, cardB, cardC, cardD, cardE];

  describe('getCardPrimaryDefinition', () => {
    it('should extract meaning and normalize part of speech based on locale', () => {
      const card: VocabularyWord = {
        id: '1',
        term: 'run',
        definitions: [
          {
            id: 'def-1',
            partOfSpeech: 'v.',
            definition: { en: 'to move fast', vi: 'chạy' },
            examples: [],
          },
        ],
      };
      const defEn = getCardPrimaryDefinition(card, Locale.EN);
      expect(defEn.meaning).toBe('to move fast');
      expect(defEn.partOfSpeech).toBe('verb');

      const defVi = getCardPrimaryDefinition(card, Locale.VI);
      expect(defVi.meaning).toBe('chạy');
    });

    it('should fall back to term when definition is missing', () => {
      const emptyDefCard: VocabularyWord = {
        id: '99',
        term: 'alone',
        definitions: [],
      };
      const def = getCardPrimaryDefinition(emptyDefCard);
      expect(def.meaning).toBe('alone');
      expect(def.partOfSpeech).toBe('');
    });
  });

  describe('selectDistractorCards', () => {
    it('should select requested number of unique distractor cards excluding target card', () => {
      const distractors = selectDistractorCards(cardA, pool, [], [], 3);
      expect(distractors).toHaveLength(3);
      expect(distractors.some((d) => d.id === cardA.id)).toBe(false);
      expect(new Set(distractors.map((d) => d.id)).size).toBe(3);
    });

    it('should fall back to fallbackPool and globalPool when primary pool is insufficient', () => {
      const smallPool = [cardA, cardB];
      const fallback = [cardC];
      const global = [cardD, cardE];

      const distractors = selectDistractorCards(
        cardA,
        smallPool,
        fallback,
        global,
        3,
      );
      expect(distractors).toHaveLength(3);
      expect(distractors.some((d) => d.id === cardA.id)).toBe(false);
    });
  });

  describe('createFlashcardItem', () => {
    it('should create a valid FLASHCARD queue item', () => {
      const item = createFlashcardItem(cardA, 0, 3);
      expect(item.exerciseType).toBe(StudyExerciseType.FLASHCARD);
      expect(item.card).toEqual(cardA);
      expect(item.stepIndex).toBe(0);
      expect(item.totalSteps).toBe(3);
      expect(item.id).toContain('flashcard_1_');
    });
  });

  describe('createChoiceTermQuestion & createChoiceMeaningQuestion', () => {
    it('should create 4 multiple choice options with exactly 1 correct option', () => {
      const item = createChoiceTermQuestion(cardA, pool);
      expect(item.exerciseType).toBe(StudyExerciseType.CHOICE_TERM);
      expect(item.options).toHaveLength(4);

      const correctOptions = item.options?.filter((o) => o.isCorrect);
      expect(correctOptions).toHaveLength(1);
      expect(correctOptions?.[0].label).toBe(cardA.term);
    });

    it('should fall back to typing exercise when fewer than 3 distractors exist', () => {
      const isolatedPool = [cardA];
      const item = createChoiceTermQuestion(cardA, isolatedPool);
      expect(item.exerciseType).toBe(StudyExerciseType.TYPING);
    });

    it('should create CHOICE_MEANING question with meaning prompt and options', () => {
      const item = createChoiceMeaningQuestion(cardA, pool);
      expect(item.exerciseType).toBe(StudyExerciseType.CHOICE_MEANING);
      expect(item.options).toHaveLength(4);
      const correctOption = item.options?.find((o) => o.isCorrect);
      expect(correctOption?.id).toBe(cardA.id);
    });
  });

  describe('createTypingQuestion', () => {
    it('should create TYPING exercise with meaning prompt', () => {
      const item = createTypingQuestion(cardA, false, 2, 3);
      expect(item.exerciseType).toBe(StudyExerciseType.TYPING);
      expect(item.meaningPrompt).toBe('quả táo');
      expect(item.stepIndex).toBe(2);
    });
  });

  describe('createProgressionExercise & createNextExerciseForWord', () => {
    it('should create Step 1 choice exercise when targetStep is 1', () => {
      const item = createProgressionExercise(cardA, 1, pool);
      expect(
        item.exerciseType === StudyExerciseType.CHOICE_TERM ||
          item.exerciseType === StudyExerciseType.CHOICE_MEANING,
      ).toBe(true);
    });

    it('should advance from choice exercise to typing exercise in createNextExerciseForWord', () => {
      const nextItem = createNextExerciseForWord(
        cardA,
        pool,
        [],
        [],
        StudyExerciseType.CHOICE_TERM,
      );
      expect(nextItem.exerciseType).toBe(StudyExerciseType.TYPING);
    });
  });
});
