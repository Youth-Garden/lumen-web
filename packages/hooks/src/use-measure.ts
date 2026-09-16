import { useCallback, useRef, useState } from 'react';

export interface Dimensions {
  width: number | null;
  height: number | null;
}

export function useMeasure<T extends HTMLElement = HTMLElement>(): [
  (node: T | null) => void,
  Dimensions,
] {
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: null,
    height: null,
  });

  const observerRef = useRef<ResizeObserver | null>(null);

  const ref = useCallback((node: T | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (node && typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(([entry]) => {
        if (entry?.borderBoxSize?.[0]) {
          const { inlineSize: width, blockSize: height } =
            entry.borderBoxSize[0];
          setDimensions({ width, height });
        } else if (entry?.contentRect) {
          setDimensions({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          });
        }
      });

      observer.observe(node);
      observerRef.current = observer;
    }
  }, []);

  return [ref, dimensions];
}
