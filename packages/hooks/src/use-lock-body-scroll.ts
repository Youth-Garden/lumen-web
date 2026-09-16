import { useLayoutEffect } from 'react';

export function useLockBodyScroll(locked: boolean = true): void {
  useLayoutEffect(() => {
    if (!locked || typeof document === 'undefined') return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [locked]);
}
