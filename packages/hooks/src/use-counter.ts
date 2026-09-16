import { useCallback, useState } from 'react';

export interface UseCounterOptions {
  min?: number;
  max?: number;
}

export interface UseCounterActions {
  increment: (delta?: number) => void;
  decrement: (delta?: number) => void;
  set: (nextCount: number) => void;
  reset: () => void;
}

export function useCounter(
  startingValue: number = 0,
  options: UseCounterOptions = {},
): [number, UseCounterActions] {
  const { min, max } = options;

  const [count, setCount] = useState<number>(startingValue);

  const increment = useCallback(
    (delta: number = 1) => {
      setCount((c) => {
        const next = c + delta;
        if (typeof max === 'number' && next > max) return c;
        return next;
      });
    },
    [max],
  );

  const decrement = useCallback(
    (delta: number = 1) => {
      setCount((c) => {
        const next = c - delta;
        if (typeof min === 'number' && next < min) return c;
        return next;
      });
    },
    [min],
  );

  const set = useCallback(
    (nextCount: number) => {
      setCount((c) => {
        if (typeof max === 'number' && nextCount > max) return c;
        if (typeof min === 'number' && nextCount < min) return c;
        return nextCount;
      });
    },
    [max, min],
  );

  const reset = useCallback(() => {
    setCount(startingValue);
  }, [startingValue]);

  return [count, { increment, decrement, set, reset }];
}
