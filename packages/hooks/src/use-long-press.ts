'use client';

import { useCallback, useRef } from 'react';

export interface UseLongPressOptions {
  threshold?: number;
  onStart?: (event: React.MouseEvent | React.TouchEvent) => void;
  onFinish?: (event: React.MouseEvent | React.TouchEvent) => void;
  onCancel?: (event: React.MouseEvent | React.TouchEvent) => void;
}

export interface UseLongPressHandlers {
  onMouseDown: (event: React.MouseEvent) => void;
  onMouseUp: (event: React.MouseEvent) => void;
  onMouseLeave: (event: React.MouseEvent) => void;
  onTouchStart: (event: React.TouchEvent) => void;
  onTouchEnd: (event: React.TouchEvent) => void;
}

export function useLongPress(
  callback: (event: React.MouseEvent | React.TouchEvent) => void,
  options: UseLongPressOptions = {},
): UseLongPressHandlers {
  const { threshold = 500, onStart, onFinish, onCancel } = options;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTriggeredRef = useRef(false);

  const start = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      onStart?.(event);
      isTriggeredRef.current = false;
      timerRef.current = setTimeout(() => {
        callback(event);
        isTriggeredRef.current = true;
      }, threshold);
    },
    [callback, threshold, onStart],
  );

  const clear = useCallback(
    (
      event: React.MouseEvent | React.TouchEvent,
      shouldTriggerFinish = true,
    ) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      if (isTriggeredRef.current) {
        if (shouldTriggerFinish) {
          onFinish?.(event);
        }
      } else {
        onCancel?.(event);
      }
    },
    [onFinish, onCancel],
  );

  return {
    onMouseDown: start,
    onMouseUp: (e) => clear(e, true),
    onMouseLeave: (e) => clear(e, false),
    onTouchStart: start,
    onTouchEnd: (e) => clear(e, true),
  };
}
