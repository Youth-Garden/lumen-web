'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

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
