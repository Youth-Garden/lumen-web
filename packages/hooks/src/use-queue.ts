'use client';

import { useCallback, useState } from 'react';

export interface UseQueueReturn<T> {
  add: (element: T | T[]) => void;
  remove: () => T | undefined;
  clear: () => void;
  set: (newQueue: T[] | ((prev: T[]) => T[])) => void;
  first: T | undefined;
  last: T | undefined;
  size: number;
  queue: T[];
}

export function useQueue<T>(initialValue: T[] = []): UseQueueReturn<T> {
  const [queue, setQueue] = useState<T[]>(initialValue);

  const add = useCallback((element: T | T[]) => {
    setQueue((q) => (Array.isArray(element) ? [...q, ...element] : [...q, element]));
  }, []);

  const remove = useCallback(() => {
    let removedElement: T | undefined;

    setQueue(([first, ...q]) => {
      removedElement = first;
      return q;
    });

    return removedElement;
  }, []);

  const clear = useCallback(() => {
    setQueue([]);
  }, []);

  return {
    add,
    remove,
    clear,
    set: setQueue,
    first: queue[0],
    last: queue[queue.length - 1],
    size: queue.length,
    queue,
  };
}
