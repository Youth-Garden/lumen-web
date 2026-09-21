import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useLongPress } from '../use-long-press';

describe('useLongPress', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should trigger callback after threshold milliseconds', () => {
    const callback = vi.fn();
    const { result } = renderHook(() =>
      useLongPress(callback, { threshold: 400 }),
    );

    const mockEvent = {} as React.MouseEvent;

    act(() => {
      result.current.onMouseDown(mockEvent);
    });
    expect(callback).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should cancel callback if mouse leaves before threshold', () => {
    const callback = vi.fn();
    const onCancel = vi.fn();
    const { result } = renderHook(() =>
      useLongPress(callback, { threshold: 500, onCancel }),
    );

    const mockEvent = {} as React.MouseEvent;

    act(() => {
      result.current.onMouseDown(mockEvent);
    });

    act(() => {
      vi.advanceTimersByTime(200);
      result.current.onMouseLeave(mockEvent);
      vi.advanceTimersByTime(300);
    });

    expect(callback).not.toHaveBeenCalled();
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
