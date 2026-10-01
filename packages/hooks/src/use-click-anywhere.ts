'use client';

import { useEventListener } from './use-event-listener';

export function useClickAnyWhere(handler: (event: MouseEvent) => void): void {
  useEventListener('click', handler);
}
