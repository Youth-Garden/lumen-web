import { useCallback, useState } from 'react';

export interface UseQueueReturn<T> {
  add: (element: T) => void;
  remove: () => T | undefined;
  clear: () => void;
  first: T | undefined;
  last: T | undefined;
  size: number;
  queue: T[];
}

export function useQueue<T>(initialValue: T[] = []): UseQueueReturn<T> {
  const [queue, setQueue] = useState<T[]>(initialValue);

  const add = useCallback((element: T) => {
    setQueue((q) => [...q, element]);
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
    first: queue[0],
    last: queue[queue.length - 1],
    size: queue.length,
    queue,
  };
}
