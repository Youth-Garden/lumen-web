'use client';

import { NATIVE_LANGUAGE_STORAGE_KEY, RouteEnum } from '@/shared/constants';
import { useRouter } from '@/shared/i18n/routing';
import { Button, Logo } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { cn } from '@lumen/uikit/utils';
import { cookieHelper } from '@lumen/utils';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

interface LanguageOption {
  code: 'vi' | 'en';
  name: string;
  nativeName: string;
  icon: 'flag-vn' | 'flag-us';
}

const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'vi',
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    icon: 'flag-vn',
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    icon: 'flag-us',
  },
];

export const WelcomeLanguagePage = () => {
  const currentLocale = useLocale() as 'vi' | 'en';
  const t = useTranslations('Auth.Welcome');
  const router = useRouter();

  const [selectedLanguage, setSelectedLanguage] = useState<'vi' | 'en'>(
    SUPPORTED_LANGUAGES.some((lang) => lang.code === currentLocale)
      ? currentLocale
      : 'vi',
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = (localStorage.getItem(NATIVE_LANGUAGE_STORAGE_KEY) ||
        cookieHelper.get(NATIVE_LANGUAGE_STORAGE_KEY)) as
        'vi' | 'en' | null;
      if (stored && SUPPORTED_LANGUAGES.some((lang) => lang.code === stored)) {
        setSelectedLanguage(stored);
      }
    }
  }, []);

  const handleSelect = (code: 'vi' | 'en') => {
    setSelectedLanguage(code);
  };

  const handleContinue = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(NATIVE_LANGUAGE_STORAGE_KEY, selectedLanguage);
      cookieHelper.set(NATIVE_LANGUAGE_STORAGE_KEY, selectedLanguage, {
        expires: 365,
        path: '/',
      });
      cookieHelper.set('NEXT_LOCALE', selectedLanguage, {
        expires: 365,
        path: '/',
      });
    }

    router.push(RouteEnum.LOGIN, { locale: selectedLanguage });
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 bg-background selection:bg-primary/20 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[500px] w-[500px] rounded-full bg-primary/15 opacity-60 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-blue-500/10 opacity-40 blur-[120px] pointer-events-none" />

      <div className="mb-6 sm:mb-8 flex items-center justify-center">
        <Logo iconSize={36} textClassName="text-2xl font-bold tracking-tight" />
      </div>

      <div className="w-full max-w-[440px] rounded-3xl bg-card p-6 sm:p-8 flex flex-col gap-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
        <div className="flex flex-col items-center gap-1.5 text-center select-none">
          <h1 className="text-xl font-bold tracking-tight text-foreground font-heading">
            {t('title')}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = selectedLanguage === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelect(lang.code)}
                className={cn(
                  'w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 cursor-pointer text-left',
                  isSelected
                    ? 'bg-primary/15 text-foreground font-medium'
                    : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground',
                )}
              >
                <div className="flex items-center gap-3.5">
                  <Icons
                    name={lang.icon}
                    size={28}
                    className="rounded-full shadow-2xs overflow-hidden shrink-0"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground leading-tight">
                      {lang.nativeName}
                    </span>
                    <span className="text-xs text-muted-foreground leading-tight">
                      {lang.name}
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <Icons
                    name="check"
                    className="w-4 h-4 text-primary shrink-0"
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="pt-2">
          <Button
            type="button"
            size="lg"
            variant="default"
            className="w-full"
            onClick={handleContinue}
          >
            {t('continueBtn')}
          </Button>
        </div>
      </div>
    </main>
  );
};

export default WelcomeLanguagePage;
