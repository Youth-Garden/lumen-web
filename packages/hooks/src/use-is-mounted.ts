'use client';

import { useCallback, useEffect, useRef } from 'react';

/**
 * Hook that returns a function to check if the component is currently mounted.
 * Useful for preventing state updates on unmounted components after async operations.
 */
export function useIsMounted(): () => boolean {
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return useCallback(() => isMountedRef.current, []);
}

/**
 * Hook that returns true on the first render, and false on subsequent renders.
 */
export function useIsFirstMount(): boolean {
  const isFirstMountRef = useRef(true);

  if (isFirstMountRef.current) {
    isFirstMountRef.current = false;
    return true;
  }

  return false;
}
