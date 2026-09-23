import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useIsomorphicLayoutEffect } from '../use-isomorphic-layout-effect';

describe('useIsomorphicLayoutEffect', () => {
  it('should execute effect callback on mount', () => {
    const effectCallback = vi.fn();

    renderHook(() => {
      useIsomorphicLayoutEffect(() => {
        effectCallback();
      }, []);
    });

    expect(effectCallback).toHaveBeenCalledTimes(1);
  });

  it('should call cleanup callback on unmount', () => {
    const cleanupCallback = vi.fn();

    const { unmount } = renderHook(() => {
      useIsomorphicLayoutEffect(() => {
        return () => {
          cleanupCallback();
        };
      }, []);
    });

    expect(cleanupCallback).not.toHaveBeenCalled();
    unmount();
    expect(cleanupCallback).toHaveBeenCalledTimes(1);
  });
});
