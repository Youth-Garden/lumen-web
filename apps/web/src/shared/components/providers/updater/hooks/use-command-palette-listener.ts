'use client';

import { CommandPalette } from '@/shared/components/command-palette';
import { useAuthStore } from '@/store/auth.store';
import { useKeyPress } from '@lumen/hooks';
import { usePortal } from '@lumen/uikit/portal';
import { useEffect } from 'react';

export function useCommandPaletteListener() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [presentCommandPalette, dismissCommandPalette, isOpen] = usePortal(
    CommandPalette,
    { key: 'command_palette' },
  );

  useEffect(() => {
    if (!isAuthenticated && isOpen) {
      dismissCommandPalette();
    }
  }, [isAuthenticated, isOpen, dismissCommandPalette]);

  useKeyPress(
    'k',
    (event) => {
      if (!isAuthenticated) return;

      event.preventDefault();
      if (isOpen) {
        dismissCommandPalette();
      } else {
        presentCommandPalette();
      }
    },
    {
      modifierKeys: { ctrlOrMeta: true },
      ignoreInputElements: false,
    },
  );
}
