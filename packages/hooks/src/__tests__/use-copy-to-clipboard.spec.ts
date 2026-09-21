import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useCopyToClipboard } from '../use-copy-to-clipboard';

describe('useCopyToClipboard', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should copy text using navigator.clipboard and update copied state', async () => {
    const { result } = renderHook(() =>
      useCopyToClipboard({ resetTimeout: 2000 }),
    );

    expect(result.current[0]).toBeNull();
    expect(result.current[2]).toBe(false);

    let success: boolean = false;
    await act(async () => {
      success = await result.current[1]('lumen vocabulary');
    });

    expect(success).toBe(true);
    expect(result.current[0]).toBe('lumen vocabulary');
    expect(result.current[2]).toBe(true);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      'lumen vocabulary',
    );

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current[2]).toBe(false);
  });

  it('should return false when empty text is provided', async () => {
    const { result } = renderHook(() => useCopyToClipboard());

    let success: boolean = true;
    await act(async () => {
      success = await result.current[1]('');
    });

    expect(success).toBe(false);
    expect(result.current[2]).toBe(false);
  });
});
