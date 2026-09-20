'use client';

import { useLocale, useTranslations } from 'next-intl';

import { useLocalStorage } from '@lumen/hooks';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { cookieHelper } from '@lumen/utils';

import { NATIVE_LANGUAGE_STORAGE_KEY } from '@/shared/constants';
import { routing, usePathname, useRouter } from '@/shared/i18n/routing';

interface LanguageSwitcherProps {
  align?: 'start' | 'end';
}

const LABELS: Record<string, { label: string; flag: string }> = {
  vi: { label: 'Tiếng Việt', flag: '🇻🇳' },
  en: { label: 'English', flag: '🇺🇸' },
  ja: { label: '日本語', flag: '🇯🇵' },
};

export function LanguageSwitcher({ align = 'end' }: LanguageSwitcherProps) {
  const t = useTranslations('Settings');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [, setStoredLanguage] = useLocalStorage<string | null>(
    NATIVE_LANGUAGE_STORAGE_KEY,
    null,
  );

  const change = (next: string) => {
    if (next !== locale) {
      setStoredLanguage(next);
      if (typeof window !== 'undefined') {
        cookieHelper.set(NATIVE_LANGUAGE_STORAGE_KEY, next, {
          expires: 365,
          path: '/',
        });
        cookieHelper.set('NEXT_LOCALE', next, {
          expires: 365,
          path: '/',
        });
      }
      router.replace(pathname, { locale: next });
    }
  };

  const currentLabel = LABELS[locale] ?? {
    label: locale.toUpperCase(),
    flag: '🌐',
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t('appearance.nativeLanguage')}
        render={
          <Button variant="outline" size="sm" className="gap-1.5 font-medium" />
        }
      >
        <span className="text-sm">{currentLabel.flag}</span>
        <span className="text-xs font-semibold uppercase tracking-wider">
          {locale}
        </span>
        <Icons name="chevron-down" className="h-3 w-3 opacity-60 ml-0.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-40 rounded-xl border border-border/60 bg-popover/95 backdrop-blur-lg shadow-xl"
      >
        {routing.locales.map((loc) => {
          const item = LABELS[loc] ?? { label: loc, flag: '🌐' };
          return (
            <DropdownMenuItem
              key={loc}
              onClick={() => change(loc)}
              className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/10"
            >
              <div className="flex items-center gap-2.5">
                <span>{item.flag}</span>
                <span>{item.label}</span>
              </div>
              {loc === locale && (
                <Icons
                  name="check"
                  className="h-4 w-4 text-primary font-bold"
                />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
