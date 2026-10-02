import { describe, expect, it } from 'vitest';
import {
  wordMapper,
  wordRelationListMapper,
  wordRelationMapper,
} from '../vocabulary.mappers';
import { WordRelationType } from '../vocabulary.types';

describe('Vocabulary Mappers Unit Tests', () => {
  describe('wordRelationMapper', () => {
    it('returns null for invalid inputs or missing fields', () => {
      expect(wordRelationMapper(null)).toBeNull();
      expect(wordRelationMapper(undefined)).toBeNull();
      expect(wordRelationMapper({})).toBeNull();
      expect(wordRelationMapper({ id: 'rel-1' })).toBeNull();
      expect(
        wordRelationMapper({
          id: 'rel-1',
          targetTerm: 'cheap',
          relationType: 'INVALID',
        }),
      ).toBeNull();
    });

    it('correctly maps valid raw word relation object', () => {
      const raw = {
        id: 'rel-100',
        sourceWordId: 'word-1',
        definitionId: 'def-1',
        targetWordId: 'word-2',
        targetTerm: '  inexpensive  ',
        relationType: 'SYNONYM',
        displayOrder: 2,
      };

      const result = wordRelationMapper(raw);
      expect(result).toEqual({
        id: 'rel-100',
        sourceWordId: 'word-1',
        definitionId: 'def-1',
        targetWordId: 'word-2',
        targetTerm: 'inexpensive',
        relationType: WordRelationType.SYNONYM,
        displayOrder: 2,
      });
    });
  });

  describe('wordRelationListMapper', () => {
    it('filters out invalid items and maps valid ones', () => {
      const rawList = [
        {
          id: 'rel-1',
          sourceWordId: 'word-1',
          targetTerm: 'cheap',
          relationType: 'SYNONYM',
        },
        null,
        { invalid: true },
        {
          id: 'rel-2',
          sourceWordId: 'word-1',
          targetTerm: 'expensive',
          relationType: 'ANTONYM',
        },
      ];

      const results = wordRelationListMapper(rawList);
      expect(results).toHaveLength(2);
      expect(results[0].targetTerm).toBe('cheap');
      expect(results[1].targetTerm).toBe('expensive');
    });
  });

  describe('wordMapper', () => {
    it('maps word definitions and relations correctly', () => {
      const rawWord = {
        id: 'word-1',
        term: 'budget',
        definitions: [
          {
            id: 'def-1',
            partOfSpeech: 'noun',
            definition: { en: 'Financial plan' },
            relations: [
              {
                id: 'rel-1',
                sourceWordId: 'word-1',
                definitionId: 'def-1',
                targetWordId: 'word-2',
                targetTerm: 'allowance',
                relationType: 'SYNONYM',
              },
            ],
          },
        ],
        relations: [
          {
            id: 'rel-2',
            sourceWordId: 'word-1',
            targetTerm: 'budget deficit',
            relationType: 'RELATED',
          },
        ],
      };

      const word = wordMapper(rawWord);
      expect(word.id).toBe('word-1');
      expect(word.term).toBe('budget');
      expect(word.definitions[0].relations).toHaveLength(1);
      expect(word.definitions[0].relations?.[0].targetTerm).toBe('allowance');
      expect(word.relations).toHaveLength(1);
      expect(word.relations?.[0].targetTerm).toBe('budget deficit');
    });
  });
});
