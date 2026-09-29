'use client';

import { RouteEnum } from '@/shared/constants';
import { useRouter } from '@/shared/i18n/routing';
import { Button } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { useTranslations } from 'next-intl';

export default function LocalizedError() {
  const t = useTranslations('Error');
  const router = useRouter();

  return (
    <main className="flex min-h-[100dvh] w-full flex-col items-center justify-center p-4 text-center">
      <div className="relative flex max-w-md flex-col items-center space-y-6">
        {/* Ambient Glow */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-destructive/10 blur-[80px] rounded-full pointer-events-none -z-10" />

        {/* Icon Badge */}
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-destructive/10 text-destructive">
          <Icons name="danger" className="h-10 w-10" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl text-foreground">
            {t('title')}
          </h1>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-2 w-full sm:w-auto">
          <Button variant="outline" size="lg" onClick={() => router.back()}>
            <Icons name="arrow-left" />
            <span>{t('goBack')}</span>
          </Button>
          <Button
            variant="default"
            size="lg"
            onClick={() => router.push(RouteEnum.DASHBOARD)}
          >
            <Icons name="home" />
            <span>{t('backHome')}</span>
          </Button>
        </div>
      </div>
    </main>
  );
}
