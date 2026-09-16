import { useCallback, useRef, useState } from 'react';

export type UseIntersectionObserverOptions = IntersectionObserverInit;

export function useIntersectionObserver<T extends HTMLElement = HTMLElement>(
  options: UseIntersectionObserverOptions = {},
): [(node: T | null) => void, IntersectionObserverEntry | null] {
  const { threshold = 1, root = null, rootMargin = '0px' } = options;
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const ref = useCallback(
    (node: T | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (node && typeof IntersectionObserver !== 'undefined') {
        const observer = new IntersectionObserver(
          ([newEntry]) => {
            setEntry(newEntry);
          },
          { threshold, root, rootMargin },
        );

        observer.observe(node);
        observerRef.current = observer;
      }
    },
    [threshold, root, rootMargin],
  );

  return [ref, entry];
}
