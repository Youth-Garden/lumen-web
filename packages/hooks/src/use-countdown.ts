import { useState, useEffect, useCallback } from 'react';

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

  useEffect(() => {
    if (!isActive) return;

    if (secondsRemaining <= 0) {
      setIsActive(false);
      onComplete?.();
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, secondsRemaining, onComplete]);

  const start = useCallback(() => setIsActive(true), []);
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
