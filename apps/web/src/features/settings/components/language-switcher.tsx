'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter, routing } from '@/shared/i18n/routing';
import { Icons } from '@lumen/uikit/icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@lumen/uikit/components';

const LABELS: Record<string, string> = {
  en: 'English',
  vi: 'Tiếng Việt',
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t('appearance.language')}
        className="inline-flex size-9 items-center justify-center rounded-lg border border-transparent bg-muted/40 text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-4 focus-visible:ring-primary/20"
      >
        <Icons name="languages" className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        {routing.locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => change(loc)}
            className="flex cursor-pointer items-center justify-between"
          >
            <span>{LABELS[loc] ?? loc}</span>
            {loc === locale && (
              <Icons name="check" className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
