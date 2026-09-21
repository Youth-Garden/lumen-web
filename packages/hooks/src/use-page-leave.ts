'use client';

import { useEffect, useRef } from 'react';

export function usePageLeave(onLeave: () => void): void {
  const onLeaveRef = useRef(onLeave);
  onLeaveRef.current = onLeave;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMouseLeave = (event: MouseEvent) => {
      const from =
        event.relatedTarget ||
        (event as unknown as { toElement: Element }).toElement;
      if (!from) {
        onLeaveRef.current();
      }
    };

    document.addEventListener('mouseout', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseout', handleMouseLeave);
    };
  }, []);
}
