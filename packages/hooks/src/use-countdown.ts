import { useCallback, useState } from 'react';
import { useInterval } from './use-interval';

interface UseCountdownOptions {
  initialSeconds: number;
  onComplete?: () => void;
  autoStart?: boolean;
}

export function useCountdown({
  initialSeconds,
  onComplete,
  autoStart = true,
}: UseCountdownOptions) {
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(autoStart);

  useInterval(
    () => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    },
    isActive && secondsRemaining > 0 ? 1000 : null,
  );

  const start = useCallback(() => {
    setSecondsRemaining((prev) => (prev <= 0 ? initialSeconds : prev));
    setIsActive(true);
  }, [initialSeconds]);
  const pause = useCallback(() => setIsActive(false), []);
  const reset = useCallback(
    (newSeconds?: number) => {
      setIsActive(false);
      setSecondsRemaining(newSeconds ?? initialSeconds);
    },
    [initialSeconds],
  );

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return {
    secondsRemaining,
    formattedTime,
    start,
    pause,
    reset,
    isActive,
  };
}
