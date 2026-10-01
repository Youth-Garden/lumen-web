import { useState } from 'react';
import { useTimeout } from './use-timeout';

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useTimeout(() => {
    setDebouncedValue(value);
  }, delay);

  return debouncedValue;
}
