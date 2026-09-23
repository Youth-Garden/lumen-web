'use client';

import { useCallback, useRef } from 'react';
import { useEventListener } from './use-event-listener';

export function usePageLeave(onLeave: () => void): void {
  const onLeaveRef = useRef(onLeave);
  onLeaveRef.current = onLeave;

  const documentRef = useRef<Document | null>(
    typeof document !== 'undefined' ? document : null,
  );

  const handleMouseLeave = useCallback((event: MouseEvent) => {
    const from =
      event.relatedTarget ||
      (event as unknown as { toElement: Element }).toElement;
    if (!from) {
      onLeaveRef.current();
    }
  }, []);

  useEventListener('mouseout', handleMouseLeave, documentRef);
}
