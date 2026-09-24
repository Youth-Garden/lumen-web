import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

import { Locale } from '../types/i18n';

export const routing = defineRouting({
  locales: [Locale.EN, Locale.VI],
  defaultLocale: Locale.VI,
  localePrefix: 'as-needed',
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

export { useLocale } from '../hooks/use-app-locale';
