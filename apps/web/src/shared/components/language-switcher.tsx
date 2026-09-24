'use client';

import { useLocale } from '@/shared/hooks';
import { useTranslations } from 'next-intl';

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

const LANGUAGE_CONFIG: Record<
  string,
  { label: string; icon: 'flag-vn' | 'flag-us' | 'flag-jp' }
> = {
  vi: { label: 'Tiếng Việt', icon: 'flag-vn' },
  en: { label: 'English', icon: 'flag-us' },
  ja: { label: '日本語', icon: 'flag-jp' },
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

  const currentConfig = LANGUAGE_CONFIG[locale] ?? {
    label: locale.toUpperCase(),
    icon: 'flag-vn',
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t('appearance.nativeLanguage')}
        render={
          <Button variant="outline" size="sm" className="gap-2 font-medium" />
        }
      >
        <Icons name={currentConfig.icon} size={18} className="shrink-0" />
        <span className="text-xs font-semibold uppercase tracking-wider">
          {locale}
        </span>
        <Icons name="chevron-down" className="h-3 w-3 opacity-60 ml-0.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        className="min-w-40 rounded-xl border border-border/60 bg-popover/95 backdrop-blur-lg shadow-xl"
      >
        {routing.locales.map((loc) => {
          const item = LANGUAGE_CONFIG[loc] ?? { label: loc, icon: 'flag-vn' };
          return (
            <DropdownMenuItem
              key={loc}
              onClick={() => change(loc)}
              className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/10"
            >
              <div className="flex items-center gap-2.5">
                <Icons name={item.icon} size={18} className="shrink-0" />
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
