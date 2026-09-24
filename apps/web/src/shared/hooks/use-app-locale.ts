import { Locale } from '@/shared/types';
import { useLocale as useNextIntlLocale } from 'next-intl';

export function useLocale(): Locale {
  return useNextIntlLocale() as Locale;
}
