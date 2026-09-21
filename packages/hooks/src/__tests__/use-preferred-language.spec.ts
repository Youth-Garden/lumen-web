import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { usePreferredLanguage } from '../use-preferred-language';

describe('usePreferredLanguage', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'languages', {
      configurable: true,
      value: ['vi-VN', 'vi', 'en-US'],
    });
  });

  it('should return primary language from navigator.languages', () => {
    const { result } = renderHook(() => usePreferredLanguage());
    expect(result.current).toBe('vi-VN');
  });

  it('should update language when languagechange event triggers', () => {
    const { result } = renderHook(() => usePreferredLanguage());

    act(() => {
      Object.defineProperty(navigator, 'languages', {
        configurable: true,
        value: ['ja-JP', 'ja'],
      });
      window.dispatchEvent(new Event('languagechange'));
    });

    expect(result.current).toBe('ja-JP');
  });
});
