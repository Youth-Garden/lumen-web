'use client';

import { useCallback, useRef } from 'react';
import { useEventListener } from '@lumen/hooks';

export function useDragScroll<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);

  const onMouseDown = useCallback((event: MouseEvent) => {
    if (event.button !== 0 || !ref.current) return;
    isDownRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = event.pageX - ref.current.offsetLeft;
    scrollLeftRef.current = ref.current.scrollLeft;
  }, []);

  const onMouseMove = useCallback((event: MouseEvent) => {
    if (!isDownRef.current || !ref.current) return;
    const x = event.pageX - ref.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.3;
    if (Math.abs(walk) > 4) {
      hasMovedRef.current = true;
    }
    ref.current.scrollLeft = scrollLeftRef.current - walk;
  }, []);

  const onMouseUp = useCallback(() => {
    isDownRef.current = false;
  }, []);

  const onMouseLeave = useCallback(() => {
    isDownRef.current = false;
  }, []);

  const onClickCapture = useCallback((event: MouseEvent) => {
    if (hasMovedRef.current) {
      event.stopPropagation();
      event.preventDefault();
      hasMovedRef.current = false;
    }
  }, []);

  const onWheel = useCallback((event: WheelEvent) => {
    const element = ref.current;
    if (!element) return;

    if (event.deltaY !== 0 && element.scrollWidth > element.clientWidth) {
      element.scrollLeft += event.deltaY;
      event.preventDefault();
    }
  }, []);

  useEventListener('mousedown', onMouseDown, ref);
  useEventListener('mousemove', onMouseMove);
  useEventListener('mouseup', onMouseUp);
  useEventListener('mouseleave', onMouseLeave, ref);
  useEventListener('click', onClickCapture, ref, true);
  useEventListener('wheel', onWheel, ref, { passive: false });

  return ref;
}
