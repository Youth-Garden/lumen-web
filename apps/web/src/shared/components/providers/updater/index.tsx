'use client';

import { useAuthUpdater, useCommandPaletteListener } from './hooks';

export function Updater() {
  useAuthUpdater();
  useCommandPaletteListener();

  return null;
}
