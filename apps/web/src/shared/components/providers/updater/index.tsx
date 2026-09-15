'use client';

import {
  useAuthUpdater,
  useCommandPaletteListener,
  useSessionExpiredListener,
} from './hooks';

export function Updater() {
  useAuthUpdater();
  useCommandPaletteListener();
  useSessionExpiredListener();

  return null;
}
