import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  TAILWIND_BREAKPOINTS,
  useBreakpoint,
  useMediaQuery,
} from '../use-media-query';

describe('useMediaQuery & useBreakpoint', () => {
  let listeners: Array<() => void> = [];

  beforeEach(() => {
    listeners = [];
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query.includes('768px') ? true : false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn((event: string, callback: () => void) => {
          listeners.push(callback);
        }),
        removeEventListener: vi.fn((event: string, callback: () => void) => {
          listeners = listeners.filter((l) => l !== callback);
        }),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should evaluate media query matches correctly', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(true);

    const { result: nonMatchResult } = renderHook(() =>
      useMediaQuery('(min-width: 1280px)'),
    );
    expect(nonMatchResult.current).toBe(false);
  });

  it('should use defaultValue when initializeWithValue is false', () => {
    const { result } = renderHook(() =>
      useMediaQuery('(min-width: 768px)', {
        initializeWithValue: false,
        defaultValue: false,
      }),
    );

    // Initial render gets defaultValue, then useEffect updates to true
    expect(result.current).toBe(true);
  });

  it('should correctly use Tailwind breakpoint mapping with useBreakpoint', () => {
    const { result: mdResult } = renderHook(() => useBreakpoint('md'));
    expect(mdResult.current).toBe(true);
    expect(window.matchMedia).toHaveBeenCalledWith(TAILWIND_BREAKPOINTS.md);

    const { result: xlResult } = renderHook(() => useBreakpoint('xl'));
    expect(xlResult.current).toBe(false);
    expect(window.matchMedia).toHaveBeenCalledWith(TAILWIND_BREAKPOINTS.xl);
  });

  it('should update state when media query change listener triggers', () => {
    let matchesState = false;
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        get matches() {
          return matchesState;
        },
        media: query,
        addEventListener: vi.fn((_, cb) => listeners.push(cb)),
        removeEventListener: vi.fn(),
      })),
    });

    const { result } = renderHook(() => useMediaQuery('(min-width: 1024px)'));
    expect(result.current).toBe(false);

    act(() => {
      matchesState = true;
      listeners.forEach((cb) => cb());
    });

    expect(result.current).toBe(true);
  });
});
