import type { VocabularyDefinition, VocabularyWord } from '@/services/vocabulary';

/**
 * Returns primary and secondary localized topic names based on locale.
 */
export function getLocalizedTopicName(
  topicEn: string,
  topicVi?: string | null,
  locale: string = 'en',
): { primary: string; secondary: string } {
  const en = topicEn || '';
  const vi = topicVi || topicEn || '';

  if (locale === 'en') {
    return {
      primary: en,
      secondary: vi !== en ? vi : '',
    };
  }

  return {
    primary: vi,
    secondary: en !== vi ? en : '',
  };
}

/**
 * Resolves the primary meaning text for a word definition based on locale.
 */
export function getLocalizedWordMeaning(
  definition?: VocabularyDefinition | null,
  locale: string = 'en',
  fallbackTerm: string = '',
): string {
  if (!definition) return fallbackTerm;

  const enDef = definition.definitionEn || definition.definition?.en || '';
  const viDef = definition.translationVi || definition.definition?.vi || '';

  if (locale === 'en') {
    return enDef || viDef || fallbackTerm;
  }

  return viDef || enDef || fallbackTerm;
}

/**
 * Resolves the primary definition for a word object based on locale.
 */
export function getLocalizedCardMeaning(
  word?: VocabularyWord | null,
  locale: string = 'en',
): string {
  if (!word) return '';
  const primaryDef = word.definitions?.[0];
  return getLocalizedWordMeaning(primaryDef, locale, word.term);
}
