'use client';

import { useCallback, useEffect, useState } from 'react';
import { useEventListener, useToggle } from '@lumen/hooks';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): void;
}

export function usePWA() {
  const [isInstalled, , setIsInstalled] = useToggle(false);
  const [showInstallPrompt, , setShowInstallPrompt] = useToggle(false);
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isOnline, , setIsOnline] = useToggle(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  );

  useEffect(() => {
    if ('serviceWorker' in navigator && !isInstalled) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          setIsInstalled(true);
          void registration.update();
        })
        .catch(() => {});
    }
  }, [isInstalled]);

  const handleBeforeInstallPrompt = useCallback((event: Event) => {
    const promptEvent = event as BeforeInstallPromptEvent;
    promptEvent.preventDefault();
    setInstallEvent(promptEvent);
    setShowInstallPrompt(true);
  }, []);

  const handleOnline = useCallback(() => setIsOnline(true), []);
  const handleOffline = useCallback(() => setIsOnline(false), []);

  useEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  useEventListener('online', handleOnline);
  useEventListener('offline', handleOffline);

  const promptInstall = async () => {
    if (!installEvent) {
      return false;
    }
    installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === 'accepted') {
      setShowInstallPrompt(false);
    }
    return choice.outcome === 'accepted';
  };

  return {
    isInstalled,
    showInstallPrompt,
    promptInstall,
    isOnline,
  };
}
