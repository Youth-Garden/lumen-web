'use client';

import { useEffect } from 'react';
import { usePortal } from '@lumen/uikit/portal';
import { CommandPalette } from '@/shared/components/command-palette';

export function useCommandPaletteListener() {
  const [presentCommandPalette, dismissCommandPalette, isOpen] = usePortal(
    CommandPalette,
    { key: 'command_palette' },
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        if (isOpen) {
          dismissCommandPalette();
        } else {
          presentCommandPalette();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, presentCommandPalette, dismissCommandPalette]);
}
