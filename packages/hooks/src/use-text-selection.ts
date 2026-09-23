'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useEventListener } from './use-event-listener';

export interface TextSelectionState {
  text: string;
  rect: DOMRect | null;
}

export const useTextSelection = (): TextSelectionState => {
  const [selection, setSelection] = useState<TextSelectionState>({
    text: '',
    rect: null,
  });

  const documentRef = useRef<Document | null>(
    typeof document !== 'undefined' ? document : null,
  );

  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const handleSelectionChange = useCallback(() => {
    clearTimeout(timeoutIdRef.current);
    timeoutIdRef.current = setTimeout(() => {
      const activeSelection = window.getSelection();

      if (!activeSelection || activeSelection.isCollapsed) {
        setSelection({ text: '', rect: null });
        return;
      }

      const text = activeSelection.toString().trim();

      if (!text) {
        setSelection({ text: '', rect: null });
        return;
      }

      const range = activeSelection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      setSelection({ text, rect });
    }, 50);
  }, []);

  useEventListener('selectionchange', handleSelectionChange, documentRef);
  useEventListener('mouseup', handleSelectionChange, documentRef);
  useEventListener('keyup', handleSelectionChange, documentRef);
  useEventListener('touchend', handleSelectionChange, documentRef);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutIdRef.current);
    };
  }, []);

  return selection;
};
