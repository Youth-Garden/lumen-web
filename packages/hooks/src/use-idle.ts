import { useEffect, useState } from 'react';

export function useIdle(ms: number = 1000 * 60): boolean {
  const [idle, setIdle] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeoutId: number;

    const handleTimeout = () => {
      setIdle(true);
    };

    let lastTime = 0;
    const handleEvent = () => {
      const now = Date.now();
      if (now - lastTime >= 500) {
        setIdle(false);
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(handleTimeout, ms);
        lastTime = now;
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        handleEvent();
      }
    };

    timeoutId = window.setTimeout(handleTimeout, ms);

    window.addEventListener('mousemove', handleEvent);
    window.addEventListener('mousedown', handleEvent);
    window.addEventListener('resize', handleEvent);
    window.addEventListener('keydown', handleEvent);
    window.addEventListener('touchstart', handleEvent);
    window.addEventListener('wheel', handleEvent);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('mousemove', handleEvent);
      window.removeEventListener('mousedown', handleEvent);
      window.removeEventListener('resize', handleEvent);
      window.removeEventListener('keydown', handleEvent);
      window.removeEventListener('touchstart', handleEvent);
      window.removeEventListener('wheel', handleEvent);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.clearTimeout(timeoutId);
    };
  }, [ms]);

  return idle;
}
