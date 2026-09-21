'use client';

import { useEffect, useRef } from 'react';

export interface UseFaviconOptions {
  restoreOnUnmount?: boolean;
}

export function useFavicon(
  href: string,
  options: UseFaviconOptions = {},
): void {
  const { restoreOnUnmount = true } = options;
  const prevFaviconRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    let link: HTMLLinkElement | null =
      document.querySelector("link[rel*='icon']");

    if (!link) {
      link = document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      document.getElementsByTagName('head')[0]?.appendChild(link);
    }

    if (prevFaviconRef.current === null) {
      prevFaviconRef.current = link.href;
    }

    link.href = href;
  }, [href]);

  useEffect(() => {
    return () => {
      if (
        restoreOnUnmount &&
        prevFaviconRef.current !== null &&
        typeof document !== 'undefined'
      ) {
        const link: HTMLLinkElement | null =
          document.querySelector("link[rel*='icon']");
        if (link) {
          link.href = prevFaviconRef.current;
        }
      }
    };
  }, [restoreOnUnmount]);
}
