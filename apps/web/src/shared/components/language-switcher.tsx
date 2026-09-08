'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter, routing } from '@/shared/i18n/routing';
import { Icons } from '@lumen/uikit/icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  buttonVariants,
} from '@lumen/uikit/components';

const LABELS: Record<string, { label: string; flag: string }> = {
  en: { label: 'English', flag: '🇺🇸' },
  vi: { label: 'Tiếng Việt', flag: '🇻🇳' },
};

export function LanguageSwitcher() {
  const t = useTranslations('Settings');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const change = (next: string) => {
    if (next !== locale) {
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
        aria-label={t('appearance.language')}
        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border/60 bg-background/80 px-3 text-foreground transition-all hover:border-primary/40 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 shadow-sm"
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
