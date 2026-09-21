import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useThrottle } from '../use-throttle';

describe('useThrottle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return initial value immediately and throttle quick updates', () => {
    let value = 'initial';
    const { result, rerender } = renderHook(() => useThrottle(value, 500));

    expect(result.current).toBe('initial');

    value = 'update 1';
    rerender();
    expect(result.current).toBe('initial');

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe('update 1');
  });
});
