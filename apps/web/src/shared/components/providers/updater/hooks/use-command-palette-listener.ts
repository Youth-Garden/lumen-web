'use client';

import { useKeyPress } from '@lumen/hooks';
import { usePortal } from '@lumen/uikit/portal';
import { CommandPalette } from '@/shared/components/command-palette';

export function useCommandPaletteListener() {
  const [presentCommandPalette, dismissCommandPalette, isOpen] = usePortal(
    CommandPalette,
    { key: 'command_palette' },
  );

  useKeyPress(
    'k',
    (event) => {
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
