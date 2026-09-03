'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

/**
 * Custom hook to navigate back to the previous page in history,
 * with an optional fallback route when no previous history exists.
 */
export function useGoBack(fallbackRoute?: string): () => void {
  const router = useRouter();

  return useCallback(() => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else if (fallbackRoute) {
      router.push(fallbackRoute);
    } else {
      router.back();
    }
  }, [router, fallbackRoute]);
}
