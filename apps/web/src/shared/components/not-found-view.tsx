'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { RouteEnum } from '@/shared/constants';
import { Button } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';

export function NotFoundView() {
  const t = useTranslations('NotFound');
  const router = useRouter();

  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center p-4 text-center">
      <div className="relative flex max-w-md flex-col items-center space-y-6">
        {/* Ambient Glow */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none -z-10" />

        {/* Icon Badge */}
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-inner">
          <Icons name="search" className="h-10 w-10" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            404 Error
          </span>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
            {t('title')}
          </h1>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Button */}
        <Button
          onClick={() => router.push(RouteEnum.DASHBOARD)}
          size="lg"
          className="mt-4"
        >
          <Icons name="home" />
          {t('backHome')}
        </Button>
      </div>
    </div>
  );
}
