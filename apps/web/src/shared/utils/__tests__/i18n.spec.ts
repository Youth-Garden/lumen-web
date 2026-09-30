import { describe, it, expect } from 'vitest';
import { Locale } from '@/shared/types';
import { i18nText, getSecondaryI18nText, includesI18n } from '../i18n';

describe('i18nText utility', () => {
  it('should return empty string when input is null, undefined, or empty', () => {
    expect(i18nText(null)).toBe('');
    expect(i18nText(undefined)).toBe('');
  });

  it('should resolve the exact target locale from dictionary object', () => {
    const dict = { en: 'Vocabulary', vi: 'Từ vựng' };
    expect(i18nText(dict, Locale.VI)).toBe('Từ vựng');
    expect(i18nText(dict, Locale.EN)).toBe('Vocabulary');
  });

  it('should fallback to en when vi is missing', () => {
    const dict = { en: 'Academic English' };
    expect(i18nText(dict, Locale.VI)).toBe('Academic English');
  });

  it('should fallback to vi when en is missing', () => {
    const dict = { vi: 'Tiếng Anh thương mại' };
    expect(i18nText(dict, Locale.EN)).toBe('Tiếng Anh thương mại');
  });
});

describe('getSecondaryI18nText utility', () => {
  it('should return empty string when input is null or undefined', () => {
    expect(getSecondaryI18nText(null)).toBe('');
    expect(getSecondaryI18nText(undefined)).toBe('');
  });

  it('should return secondary text for VI and empty string for EN', () => {
    const dict = { en: 'Hello', vi: 'Xin chào' };
    expect(getSecondaryI18nText(dict, Locale.VI)).toBe('Hello');
    expect(getSecondaryI18nText(dict, Locale.EN)).toBe('');
  });
});

describe('includesI18n utility', () => {
  it('should return false for empty inputs', () => {
    expect(includesI18n(null, 'test')).toBe(false);
    expect(includesI18n(undefined, 'test')).toBe(false);
    expect(includesI18n({}, 'test')).toBe(false);
  });

  it('should match case-insensitively across all language keys', () => {
    const folderName = { en: 'Daily Communication', vi: 'Giao tiếp hàng ngày' };
    expect(includesI18n(folderName, 'daily')).toBe(true);
    expect(includesI18n(folderName, 'giao tiếp')).toBe(true);
    expect(includesI18n(folderName, 'XYZ')).toBe(false);
  });
});
