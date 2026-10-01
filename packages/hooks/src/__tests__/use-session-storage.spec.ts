import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useSessionStorage } from '../use-session-storage';

describe('useSessionStorage', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('should initialize with value from sessionStorage or fallback', () => {
    const { result } = renderHook(() => useSessionStorage('test-key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('should update sessionStorage when value changes', () => {
    const { result } = renderHook(() => useSessionStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
    expect(window.sessionStorage.getItem('test-key')).toBe(JSON.stringify('updated'));
  });
});
