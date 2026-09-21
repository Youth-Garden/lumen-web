import { describe, it, expect } from 'vitest';
import {
  calculateNewFlashcardProgress,
  calculateNextProgressOnAnswer,
  calculateTargetSessionPoints,
  calculateCumulativeProgressPercent,
  filterPoolCards,
  resolveStudyPool,
  determineFlashcardQuality,
  sortMissedWords,
  updateMasteredWordIds,
  recordMissedWordItem,
  updateCardProgressMap,
} from '../study-session.utils';
import { FlashcardRating } from '@/services/study';
import { StudySessionMode } from '@/features/study/types/study.types';
import { type VocabularyWord } from '@/services/vocabulary';

const createMockWord = (
  id: string,
  term: string,
  level = 0,
  learningStep = 0,
  topic = 'Chung',
): VocabularyWord => ({
  id,
  term,
  definitions: [
    {
      id: `def-${id}`,
      partOfSpeech: 'noun',
      definitionEn: `${term} meaning`,
      translationVi: `${term} meaning`,
      examples: [],
    },
  ],
  level,
  learningStep,
  masteryScore: level * 20,
  topic,
});

describe('study-session.utils', () => {
  describe('calculateNewFlashcardProgress', () => {
    it('should set level 6 and isMastered true when rated FAST_TRACK_KNOWN', () => {
      const result = calculateNewFlashcardProgress(
        FlashcardRating.FAST_TRACK_KNOWN,
        0,
        0,
      );
      expect(result).toEqual({
        newLevel: 6,
        newLearningStep: 6,
        isMastered: true,
      });
    });

    it('should set level 3 and isMastered false when rated FAST_TRACK_TEMP', () => {
      const result = calculateNewFlashcardProgress(
        FlashcardRating.FAST_TRACK_TEMP,
        0,
        0,
      );
      expect(result).toEqual({
        newLevel: 3,
        newLearningStep: 3,
        isMastered: false,
      });
    });

    it('should decrement level on WRONG rating and not drop below 0', () => {
      const resultZero = calculateNewFlashcardProgress(
        FlashcardRating.WRONG,
        0,
        0,
      );
      expect(resultZero).toEqual({
        newLevel: 0,
        newLearningStep: 0,
        isMastered: false,
      });

      const resultFromTwo = calculateNewFlashcardProgress(
        FlashcardRating.WRONG,
        2,
        3,
      );
      expect(resultFromTwo).toEqual({
        newLevel: 1,
        newLearningStep: 1,
        isMastered: false,
      });
    });

    it('should increment learningStep up to 5 on CORRECT rating', () => {
      const result = calculateNewFlashcardProgress(
        FlashcardRating.CORRECT,
        2,
        4,
      );
      expect(result).toEqual({
        newLevel: 2,
        newLearningStep: 5,
        isMastered: false,
      });

      const cappedResult = calculateNewFlashcardProgress(
        FlashcardRating.CORRECT,
        2,
        5,
      );
      expect(cappedResult.newLearningStep).toBe(5);
    });
  });

  describe('calculateNextProgressOnAnswer', () => {
    it('should increase step on correct answer', () => {
      const result = calculateNextProgressOnAnswer(true, 1, 2);
      expect(result).toEqual({ level: 1, learningStep: 3 });
    });

    it('should penalize level on incorrect answer', () => {
      const result = calculateNextProgressOnAnswer(false, 3, 2);
      expect(result).toEqual({ level: 2, learningStep: 1 });
    });
  });

  describe('filterPoolCards & resolveStudyPool', () => {
    const mockCards: VocabularyWord[] = [
      createMockWord('1', 'apple', 0, 0, 'Food'),
      createMockWord('2', 'banana', 0, 0, 'Food'),
      createMockWord('3', 'car', 2, 2, 'Transport'),
      createMockWord('4', 'bus', 1, 1, 'Transport'),
      createMockWord('5', 'dog', 0, 0, 'Animals'),
    ];

    it('should filter pool cards by selected topic', () => {
      const foodCards = filterPoolCards(mockCards, 'Food');
      expect(foodCards).toHaveLength(2);
      expect(foodCards.every((c) => c.topic === 'Food')).toBe(true);
    });

    it('should prioritize unlearned words first in LEARN_NEW mode', () => {
      const pool = resolveStudyPool(
        mockCards,
        undefined,
        StudySessionMode.LEARN_NEW,
        2,
        5,
      );
      expect(pool.length).toBeGreaterThanOrEqual(2);
      // First 2 should be unlearned cards (level 0)
      expect(pool[0].level).toBe(0);
      expect(pool[1].level).toBe(0);
    });

    it('should return due or learned cards in PRACTICE mode', () => {
      const pool = resolveStudyPool(
        mockCards,
        undefined,
        StudySessionMode.PRACTICE,
        5,
        10,
      );
      expect(pool.every((c) => (c.level ?? 0) >= 1)).toBe(true);
    });
  });

  describe('calculateTargetSessionPoints & calculateCumulativeProgressPercent', () => {
    it('should return at least 1 point for empty pool', () => {
      expect(calculateTargetSessionPoints([], StudySessionMode.LEARN_NEW)).toBe(
        1,
      );
    });

    it('should calculate points according to multiplier', () => {
      const cards = [createMockWord('1', 'a'), createMockWord('2', 'b')];
      expect(
        calculateTargetSessionPoints(cards, StudySessionMode.FLASHCARD),
      ).toBe(2);
      expect(
        calculateTargetSessionPoints(cards, StudySessionMode.PRACTICE),
      ).toBe(4);
      expect(
        calculateTargetSessionPoints(cards, StudySessionMode.LEARN_NEW),
      ).toBe(6);
    });

    it('should cap progress percent at 99% before finished and return 100% when finished', () => {
      expect(calculateCumulativeProgressPercent(10, 10, false)).toBe(99);
      expect(calculateCumulativeProgressPercent(10, 10, true)).toBe(100);
      expect(calculateCumulativeProgressPercent(5, 10, false)).toBe(50);
      expect(calculateCumulativeProgressPercent(0, 0, false)).toBe(0);
    });
  });

  describe('determineFlashcardQuality', () => {
    it('should map ratings correctly', () => {
      expect(determineFlashcardQuality(FlashcardRating.WRONG)).toBe(
        FlashcardRating.WRONG,
      );
      expect(determineFlashcardQuality(FlashcardRating.FAST_TRACK_KNOWN)).toBe(
        FlashcardRating.FAST_TRACK_KNOWN,
      );
      expect(determineFlashcardQuality(FlashcardRating.FAST_TRACK_TEMP)).toBe(
        FlashcardRating.FAST_TRACK_TEMP,
      );
      expect(determineFlashcardQuality(FlashcardRating.CORRECT)).toBe(
        FlashcardRating.CORRECT,
      );
    });
  });

  describe('sortMissedWords & recordMissedWordItem', () => {
    it('should sort missed words descending by errorCount', () => {
      const cardA = createMockWord('1', 'alpha');
      const cardB = createMockWord('2', 'beta');
      const missedMap = {
        alpha: { card: cardA, errorCount: 1 },
        beta: { card: cardB, errorCount: 4 },
      };

      const sorted = sortMissedWords(missedMap);
      expect(sorted[0].card.term).toBe('beta');
      expect(sorted[0].errorCount).toBe(4);
      expect(sorted[1].card.term).toBe('alpha');
      expect(sorted[1].errorCount).toBe(1);
    });

    it('should increment errorCount in recordMissedWordItem', () => {
      const card = createMockWord('1', 'hello');
      const map1 = recordMissedWordItem({}, card);
      expect(map1.hello.errorCount).toBe(1);

      const map2 = recordMissedWordItem(map1, card);
      expect(map2.hello.errorCount).toBe(2);
    });
  });

  describe('updateMasteredWordIds & updateCardProgressMap', () => {
    it('should add unique card IDs without duplicates', () => {
      const ids = updateMasteredWordIds(['c1', 'c2'], 'c3');
      expect(ids).toEqual(['c1', 'c2', 'c3']);

      const duplicate = updateMasteredWordIds(ids, 'c2');
      expect(duplicate).toEqual(['c1', 'c2', 'c3']);
    });

    it('should update progress map accurately', () => {
      const map = updateCardProgressMap({}, 'card-1', 3, 2);
      expect(map['card-1']).toEqual({ level: 3, learningStep: 2 });
    });
  });
});
