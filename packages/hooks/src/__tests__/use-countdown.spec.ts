import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useCountdown } from '../use-countdown';

describe('useCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with formatted time and tick down when autoStart is true', () => {
    const { result } = renderHook(() =>
      useCountdown({ initialSeconds: 65, autoStart: true }),
    );

    expect(result.current.secondsRemaining).toBe(65);
    expect(result.current.formattedTime).toBe('01:05');
    expect(result.current.isActive).toBe(true);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.secondsRemaining).toBe(60);
    expect(result.current.formattedTime).toBe('01:00');
  });

  it('should call onComplete when countdown reaches zero', () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() =>
      useCountdown({ initialSeconds: 3, autoStart: true, onComplete }),
    );

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.secondsRemaining).toBe(0);
    expect(result.current.isActive).toBe(false);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('should pause and reset countdown correctly', () => {
    const { result } = renderHook(() =>
      useCountdown({ initialSeconds: 30, autoStart: false }),
    );

    expect(result.current.isActive).toBe(false);

    act(() => {
      result.current.start();
    });
    expect(result.current.isActive).toBe(true);

    act(() => {
      vi.advanceTimersByTime(10000);
    });
    expect(result.current.secondsRemaining).toBe(20);

    act(() => {
      result.current.pause();
    });
    expect(result.current.isActive).toBe(false);

    act(() => {
      result.current.reset(45);
    });
    expect(result.current.secondsRemaining).toBe(45);
  });

  it('should restart from initialSeconds when start() is called after expiration', () => {
    const { result } = renderHook(() =>
      useCountdown({ initialSeconds: 5, autoStart: true }),
    );

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(result.current.secondsRemaining).toBe(0);

    act(() => {
      result.current.start();
    });
    expect(result.current.secondsRemaining).toBe(5);
    expect(result.current.isActive).toBe(true);
  });
});
