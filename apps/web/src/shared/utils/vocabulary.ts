import { PartOfSpeech } from '@/shared/types';

export function normalizePartOfSpeech(pos?: string | null): string {
  if (!pos) return '';
  const trimmed = pos.trim().toLowerCase().replace(/\.$/, '');
  switch (trimmed) {
    case 'n':
    case 'noun':
      return PartOfSpeech.NOUN;
    case 'v':
    case 'verb':
      return PartOfSpeech.VERB;
    case 'adj':
    case 'adjective':
      return PartOfSpeech.ADJECTIVE;
    case 'adv':
    case 'adverb':
      return PartOfSpeech.ADVERB;
    case 'prep':
    case 'preposition':
      return PartOfSpeech.PREPOSITION;
    case 'conj':
    case 'conjunction':
      return PartOfSpeech.CONJUNCTION;
    case 'pron':
    case 'pronoun':
      return PartOfSpeech.PRONOUN;
    case 'interj':
    case 'interjection':
      return PartOfSpeech.INTERJECTION;
    case 'phr':
    case 'phrase':
      return PartOfSpeech.PHRASE;
    case 'idiom':
      return PartOfSpeech.IDIOM;
    case 'num':
    case 'numeral':
      return PartOfSpeech.NUMERAL;
    default:
      return pos.trim();
  }
}

export function formatPartOfSpeechShort(pos?: string | null): string {
  const normalized = normalizePartOfSpeech(pos);
  switch (normalized) {
    case PartOfSpeech.NOUN:
      return 'n.';
    case PartOfSpeech.VERB:
      return 'v.';
    case PartOfSpeech.ADJECTIVE:
      return 'adj.';
    case PartOfSpeech.ADVERB:
      return 'adv.';
    case PartOfSpeech.PREPOSITION:
      return 'prep.';
    case PartOfSpeech.CONJUNCTION:
      return 'conj.';
    case PartOfSpeech.PRONOUN:
      return 'pron.';
    case PartOfSpeech.INTERJECTION:
      return 'interj.';
    case PartOfSpeech.PHRASE:
      return 'phr.';
    case PartOfSpeech.IDIOM:
      return 'idiom';
    case PartOfSpeech.NUMERAL:
      return 'num.';
    default:
      return pos ? `${pos.trim()}` : '';
  }
}
