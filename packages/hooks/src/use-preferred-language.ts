'use client';

import { useEffect, useState } from 'react';

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

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleLanguageChange = () => {
      setLanguage(getLanguage());
    };

    window.addEventListener('languagechange', handleLanguageChange);

    return () => {
      window.removeEventListener('languagechange', handleLanguageChange);
    };
  }, []);

  return language;
}
