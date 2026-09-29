'use client';

import { useLocale } from '@/shared/hooks';
import { useTranslations } from 'next-intl';

import { useLocalStorage } from '@lumen/hooks';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
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
          <Button variant="outline" size="sm" className="gap-1.5 font-medium" />
        }
      >
        <Icons name={currentConfig.icon} size={18} className="shrink-0" />
        <span className="text-xs font-semibold uppercase tracking-wider">
          {locale}
        </span>
        <Icons name="chevron-down" className="h-3 w-3 opacity-60 ml-0.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-36 rounded-xl">
        <DropdownMenuRadioGroup value={locale} onValueChange={change}>
          {routing.locales.map((loc) => {
            const item = LANGUAGE_CONFIG[loc] ?? {
              label: loc,
              icon: 'flag-vn',
            };
            return (
              <DropdownMenuRadioItem
                key={loc}
                value={loc}
                className="gap-2.5 text-xs py-2"
              >
                <Icons name={item.icon} size={18} className="shrink-0" />
                <span>{item.label}</span>
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
