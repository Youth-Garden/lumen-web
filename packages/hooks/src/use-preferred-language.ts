'use client';

import { useCallback, useState } from 'react';
import { useEventListener } from './use-event-listener';

export function usePreferredLanguage(): string {
  const getLanguage = (): string => {
    if (typeof window === 'undefined' || !navigator) {
      return 'en';
    }
    return (
      (navigator.languages && navigator.languages[0]) ||
      navigator.language ||
      'en'
    );
  };

  const [language, setLanguage] = useState<string>(getLanguage);

  const handleLanguageChange = useCallback(() => {
    setLanguage(getLanguage());
  }, []);

  useEventListener('languagechange', handleLanguageChange);

  return language;
}
