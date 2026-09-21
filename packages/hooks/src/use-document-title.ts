'use client';

import { useEffect, useRef } from 'react';

export interface UseDocumentTitleOptions {
  restoreOnUnmount?: boolean;
}

export function useDocumentTitle(
  title: string,
  options: UseDocumentTitleOptions = {},
): void {
  const { restoreOnUnmount = true } = options;
  const defaultTitleRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    if (defaultTitleRef.current === null) {
      defaultTitleRef.current = document.title;
    }

    document.title = title;
  }, [title]);

  useEffect(() => {
    return () => {
      if (
        restoreOnUnmount &&
        defaultTitleRef.current !== null &&
        typeof document !== 'undefined'
      ) {
        document.title = defaultTitleRef.current;
      }
    };
  }, [restoreOnUnmount]);
}
