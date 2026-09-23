import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSubmitLock } from '../use-submit-lock';

describe('useSubmitLock', () => {
  it('should initialize with isLocked = false', () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useSubmitLock(fn));
    const [, { isLocked }] = result.current;
    expect(isLocked).toBe(false);
  });

  it('should execute action and lock', async () => {
    const fn = vi.fn().mockResolvedValue('ok');
    const { result } = renderHook(() => useSubmitLock(fn));

    let res: string | undefined;
    await act(async () => {
      res = await result.current[0]();
    });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(res).toBe('ok');
    expect(result.current[1].isLocked).toBe(true);
  });

  it('should ignore duplicate calls while locked', async () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useSubmitLock(fn));

    await act(async () => {
      await result.current[0]();
      await result.current[0]();
      await result.current[0]();
    });

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should allow execution again after unlock', async () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useSubmitLock(fn));

    await act(async () => {
      await result.current[0]();
    });
    expect(fn).toHaveBeenCalledTimes(1);

    act(() => {
      result.current[1].unlock();
    });
    expect(result.current[1].isLocked).toBe(false);

    await act(async () => {
      await result.current[0]();
    });
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should auto-unlock on error if autoUnlockOnError is true', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() =>
      useSubmitLock(fn, { autoUnlockOnError: true }),
    );

    await act(async () => {
      await expect(result.current[0]()).rejects.toThrow('Network error');
    });

    expect(result.current[1].isLocked).toBe(false);
  });
});
