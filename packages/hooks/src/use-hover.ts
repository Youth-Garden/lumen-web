'use client';

import { useState, type RefObject } from 'react';
import { useEventListener } from './use-event-listener';

export function useHover<T extends HTMLElement = HTMLElement>(
  elementRef: RefObject<T | null>,
): boolean {
  const [value, setValue] = useState(false);

  const handleMouseEnter = () => setValue(true);
  const handleMouseLeave = () => setValue(false);

  useEventListener('mouseenter', handleMouseEnter, elementRef);
  useEventListener('mouseleave', handleMouseLeave, elementRef);

  return value;
}
