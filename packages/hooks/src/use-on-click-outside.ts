'use client';

import { useCallback, useRef, type RefObject } from 'react';
import { useEventListener } from './use-event-listener';

type AnyEvent = MouseEvent | TouchEvent;

export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: AnyEvent) => void,
) {
  const documentRef = useRef<Document | null>(
    typeof document !== 'undefined' ? document : null,
  );

  const listener = useCallback(
    (event: AnyEvent) => {
      const el = ref?.current;

      if (!el || el.contains(event.target as Node)) {
        return;
      }

      handler(event);
    },
    [ref, handler],
  );

  useEventListener('mousedown', listener, documentRef);
  useEventListener('touchstart', listener, documentRef);
}
