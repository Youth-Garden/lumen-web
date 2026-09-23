'use client';

import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect';

export function useLockBodyScroll(locked: boolean = true): void {
  useIsomorphicLayoutEffect(() => {
    if (!locked || typeof document === 'undefined') return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [locked]);
}
