'use client';

import { useState, useCallback, useEffect } from 'react';
import { useEventListener } from './use-event-listener';

interface WindowSize {
  width: number | undefined;
  height: number | undefined;
}

export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
  });

  const handleResize = useCallback(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useEventListener('resize', handleResize);

  useEffect(() => {
    handleResize();
  }, [handleResize]);

  return windowSize;
}
