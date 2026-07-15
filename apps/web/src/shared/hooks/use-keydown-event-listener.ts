import { useEffect } from 'react';

export function useKeydownEventListener(
  handler: (event: KeyboardEvent) => void,
  dependencies: any[] = [],
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.tagName === 'SELECT' ||
        (document.activeElement as HTMLElement)?.isContentEditable
      ) {
        return;
      }
      handler(event);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}
