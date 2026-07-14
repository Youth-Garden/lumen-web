import { useState, useEffect } from 'react';

export interface TextSelectionState {
  text: string;
  rect: DOMRect | null;
}

export const useTextSelection = (): TextSelectionState => {
  const [selection, setSelection] = useState<TextSelectionState>({
    text: '',
    rect: null,
  });

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const handleSelectionChange = () => {
      // Add a slight debounce to avoid flickering when selecting text dynamically
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
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
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    document.addEventListener('mouseup', handleSelectionChange);
    document.addEventListener('keyup', handleSelectionChange);
    document.addEventListener('touchend', handleSelectionChange);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('mouseup', handleSelectionChange);
      document.removeEventListener('keyup', handleSelectionChange);
      document.removeEventListener('touchend', handleSelectionChange);
    };
  }, []);

  return selection;
};
