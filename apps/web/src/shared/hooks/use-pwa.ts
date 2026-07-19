'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): void;
}

export function usePWA() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  );

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator && !isInstalled) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(() => setIsInstalled(true))
        .catch(() => {
          // Service worker registration failed
        });
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setInstallEvent(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener(
      'beforeinstallprompt' as keyof WindowEventMap,
      handleBeforeInstallPrompt as EventListenerOrEventListenerObject,
    );

    // Online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt' as keyof WindowEventMap,
        handleBeforeInstallPrompt as EventListenerOrEventListenerObject,
      );
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isInstalled]);

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
