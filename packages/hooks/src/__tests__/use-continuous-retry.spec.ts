import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useContinuousRetry } from '../use-continuous-retry';

describe('useContinuousRetry', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should resolve immediately if callback succeeds on first attempt', async () => {
    const fn = vi.fn().mockResolvedValue('success');
    const { result } = renderHook(() => useContinuousRetry(fn));

    await act(async () => {
      vi.advanceTimersByTime(1);
    });

    expect(result.current.data).toBe('success');
    expect(result.current.hasResolved).toBe(true);
    expect(result.current.retries).toBe(0);
  });

  it('should retry on failure until maxRetries is reached', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('fail'));
    const { result } = renderHook(() =>
      useContinuousRetry(fn, { interval: 500, maxRetries: 2 }),
    );

    await act(async () => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current.retries).toBe(1);

    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current.retries).toBe(2);
    expect(result.current.hasResolved).toBe(false);
  });
});
