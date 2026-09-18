'use client';

import { useEffect, useRef } from 'react';

/**
 * Hook that executes a callback function when the component unmounts.
 * Uses a ref to ensure the latest callback reference is called without
 * re-subscribing the unmount effect.
 */
export function useUnmount(fn: () => void): void {
  const fnRef = useRef(fn);
  fnRef.current = fn;

  useEffect(() => {
    return () => {
      fnRef.current();
    };
  }, []);
}
