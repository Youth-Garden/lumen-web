'use client';

import { useState, useEffect } from 'react';

export type TailwindBreakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export const TAILWIND_BREAKPOINTS: Record<TailwindBreakpoint, string> = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
};

export interface UseMediaQueryOptions {
  defaultValue?: boolean;
  initializeWithValue?: boolean;
}

/**
 * useMediaQuery hook to listen to CSS media query changes.
 *
 * NOTE (CSS-First Rule):
 * Always prefer Tailwind responsive CSS classes (`hidden md:block`, `flex md:hidden`, `sm:grid-cols-2`)
 * for styling, layout, and visibility to avoid SSR Hydration Mismatches and Cumulative Layout Shift (CLS).
 * Only use this hook for non-styling JavaScript operations (e.g. dynamic canvas dimensions, portal logic).
 */
export function useMediaQuery(
  query: string,
  options: UseMediaQueryOptions = {},
): boolean {
  const { defaultValue = false, initializeWithValue = true } = options;

  const getMatches = (): boolean => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia(query).matches;
    }
    return defaultValue;
  };

  const [matches, setMatches] = useState<boolean>(() => {
    if (initializeWithValue) {
      return getMatches();
    }
    return defaultValue;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const matchMedia = window.matchMedia(query);
    const handleChange = () => {
      setMatches(matchMedia.matches);
    };

    handleChange();

    matchMedia.addEventListener('change', handleChange);

    return () => {
      matchMedia.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
}

/**
 * useBreakpoint hook aligned with Lumen's Tailwind CSS breakpoints.
 * Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px).
 */
export function useBreakpoint(
  breakpoint: TailwindBreakpoint,
  options: UseMediaQueryOptions = {},
): boolean {
  return useMediaQuery(TAILWIND_BREAKPOINTS[breakpoint], options);
}
