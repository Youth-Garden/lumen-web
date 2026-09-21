import { describe, it, expect } from 'vitest';
import { getLocalizedText } from '../folder-localization.utils';

describe('folder-localization.utils', () => {
  describe('getLocalizedText', () => {
    it('should return empty string for null, undefined, or empty values', () => {
      expect(getLocalizedText(null)).toBe('');
      expect(getLocalizedText(undefined)).toBe('');
    });

    it('should return raw string when value is a simple string', () => {
      expect(getLocalizedText('My Custom Folder')).toBe('My Custom Folder');
    });

    it('should return locale string when matched', () => {
      const i18n = { en: 'Vocabulary', vi: 'Từ vựng' };
      expect(getLocalizedText(i18n, 'vi')).toBe('Từ vựng');
      expect(getLocalizedText(i18n, 'en')).toBe('Vocabulary');
    });

    it('should fall back to fallback locale if current locale is missing', () => {
      const i18n = { en: 'Vocabulary' };
      expect(getLocalizedText(i18n, 'ja', 'en')).toBe('Vocabulary');
    });

    it('should return first available value if neither requested nor fallback locale is found', () => {
      const i18n = { fr: 'Vocabulaire' } as unknown as Parameters<
        typeof getLocalizedText
      >[0];
      expect(getLocalizedText(i18n, 'vi', 'en')).toBe('Vocabulaire');
    });
  });
});
