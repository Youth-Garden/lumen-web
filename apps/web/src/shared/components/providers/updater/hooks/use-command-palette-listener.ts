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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
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
