'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseContinuousRetryOptions {
  interval?: number;
  maxRetries?: number;
}

export function useContinuousRetry<T>(
  callback: () => Promise<T> | T,
  options: UseContinuousRetryOptions = {},
): {
  data: T | null;
  error: Error | null;
  hasResolved: boolean;
  retries: number;
} {
  const { interval = 1000, maxRetries = Infinity } = options;
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [hasResolved, setHasResolved] = useState(false);
  const [retries, setRetries] = useState(0);

  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const attempt = useCallback(async () => {
    try {
      const result = await callbackRef.current();
      setData(result);
      setHasResolved(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setRetries((prev) => prev + 1);
    }
  }, []);

  useEffect(() => {
    if (hasResolved || retries >= maxRetries) return;

    const timer = setTimeout(
      () => {
        attempt();
      },
      retries === 0 ? 0 : interval,
    );

    return () => clearTimeout(timer);
  }, [attempt, hasResolved, interval, maxRetries, retries]);

  return { data, error, hasResolved, retries };
}
