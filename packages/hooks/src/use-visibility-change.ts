import { useSyncExternalStore } from 'react';

const subscribe = (callback: () => void) => {
  if (typeof document === 'undefined') return () => {};
  document.addEventListener('visibilitychange', callback);
  return () => document.removeEventListener('visibilitychange', callback);
};

const getSnapshot = (): boolean => {
  if (typeof document === 'undefined') return true;
  return document.visibilityState === 'visible';
};

const getServerSnapshot = (): boolean => true;

export function useVisibilityChange(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
