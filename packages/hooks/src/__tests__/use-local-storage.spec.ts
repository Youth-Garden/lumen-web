import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { useLocalStorage } from '../use-local-storage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should return initial value when key is not in localStorage', () => {
    const { result } = renderHook(() =>
      useLocalStorage('test-key', { count: 0 }),
    );

    expect(result.current[0]).toEqual({ count: 0 });
  });

  it('should update localStorage when setValue is called', () => {
    const { result } = renderHook(() => useLocalStorage('theme-key', 'light'));

    act(() => {
      result.current[1]('dark');
    });

    expect(result.current[0]).toBe('dark');
    expect(JSON.parse(window.localStorage.getItem('theme-key') || '""')).toBe(
      'dark',
    );
  });

  it('should support functional updates for setValue', () => {
    const { result } = renderHook(() => useLocalStorage('num-key', 10));

    act(() => {
      result.current[1]((prev) => prev + 5);
    });

    expect(result.current[0]).toBe(15);
  });
});
