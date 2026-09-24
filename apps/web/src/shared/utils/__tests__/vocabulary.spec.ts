import { describe, it, expect } from 'vitest';
import { PartOfSpeech } from '@/shared/types';
import {
  normalizePartOfSpeech,
  formatPartOfSpeechShort,
} from '../vocabulary';

describe('normalizePartOfSpeech', () => {
  it('should normalize standard single letters and abbreviations', () => {
    expect(normalizePartOfSpeech('n')).toBe(PartOfSpeech.NOUN);
    expect(normalizePartOfSpeech('n.')).toBe(PartOfSpeech.NOUN);
    expect(normalizePartOfSpeech('noun')).toBe(PartOfSpeech.NOUN);
    expect(normalizePartOfSpeech('v')).toBe(PartOfSpeech.VERB);
    expect(normalizePartOfSpeech('v.')).toBe(PartOfSpeech.VERB);
    expect(normalizePartOfSpeech('verb')).toBe(PartOfSpeech.VERB);
    expect(normalizePartOfSpeech('adj')).toBe(PartOfSpeech.ADJECTIVE);
    expect(normalizePartOfSpeech('adj.')).toBe(PartOfSpeech.ADJECTIVE);
    expect(normalizePartOfSpeech('adjective')).toBe(PartOfSpeech.ADJECTIVE);
    expect(normalizePartOfSpeech('adv')).toBe(PartOfSpeech.ADVERB);
    expect(normalizePartOfSpeech('adv.')).toBe(PartOfSpeech.ADVERB);
    expect(normalizePartOfSpeech('adverb')).toBe(PartOfSpeech.ADVERB);
    expect(normalizePartOfSpeech('prep')).toBe(PartOfSpeech.PREPOSITION);
    expect(normalizePartOfSpeech('prep.')).toBe(PartOfSpeech.PREPOSITION);
    expect(normalizePartOfSpeech('preposition')).toBe(PartOfSpeech.PREPOSITION);
    expect(normalizePartOfSpeech('conj')).toBe(PartOfSpeech.CONJUNCTION);
    expect(normalizePartOfSpeech('conj.')).toBe(PartOfSpeech.CONJUNCTION);
    expect(normalizePartOfSpeech('pron')).toBe(PartOfSpeech.PRONOUN);
    expect(normalizePartOfSpeech('interj')).toBe(PartOfSpeech.INTERJECTION);
    expect(normalizePartOfSpeech('phr')).toBe(PartOfSpeech.PHRASE);
    expect(normalizePartOfSpeech('idiom')).toBe(PartOfSpeech.IDIOM);
    expect(normalizePartOfSpeech('num')).toBe(PartOfSpeech.NUMERAL);
  });

  it('should handle uppercase or untrimmed strings gracefully', () => {
    expect(normalizePartOfSpeech('  NOUN  ')).toBe(PartOfSpeech.NOUN);
    expect(normalizePartOfSpeech('ADJ.')).toBe(PartOfSpeech.ADJECTIVE);
  });

  it('should return empty string for null, undefined, or empty string', () => {
    expect(normalizePartOfSpeech('')).toBe('');
    expect(normalizePartOfSpeech(null)).toBe('');
    expect(normalizePartOfSpeech(undefined)).toBe('');
  });

  it('should return unknown parts of speech as trimmed string', () => {
    expect(normalizePartOfSpeech('custom_pos')).toBe('custom_pos');
  });
});

describe('formatPartOfSpeechShort', () => {
  it('should format standard parts of speech to concise abbreviations', () => {
    expect(formatPartOfSpeechShort('noun')).toBe('n.');
    expect(formatPartOfSpeechShort('verb')).toBe('v.');
    expect(formatPartOfSpeechShort('adjective')).toBe('adj.');
    expect(formatPartOfSpeechShort('adverb')).toBe('adv.');
    expect(formatPartOfSpeechShort('preposition')).toBe('prep.');
    expect(formatPartOfSpeechShort('conjunction')).toBe('conj.');
    expect(formatPartOfSpeechShort('pronoun')).toBe('pron.');
    expect(formatPartOfSpeechShort('interjection')).toBe('interj.');
    expect(formatPartOfSpeechShort('phrase')).toBe('phr.');
    expect(formatPartOfSpeechShort('idiom')).toBe('idiom');
    expect(formatPartOfSpeechShort('numeral')).toBe('num.');
  });

  it('should handle null/empty correctly', () => {
    expect(formatPartOfSpeechShort('')).toBe('');
    expect(formatPartOfSpeechShort(null)).toBe('');
    expect(formatPartOfSpeechShort(undefined)).toBe('');
  });
});
