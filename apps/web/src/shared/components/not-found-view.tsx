'use client';

import { RouteEnum } from '@/shared/constants';
import { useBreadcrumb } from '@/shared/hooks';
import { Button } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function NotFoundView() {
  const t = useTranslations('NotFound');
  const router = useRouter();
  const { clearBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    clearBreadcrumbs();
  }, [clearBreadcrumbs]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-4 text-center">
      <div className="flex max-w-md flex-col items-center space-y-5">
        {/* Standalone 3D Empty State Image */}
        <Image
          src="/images/common/empty-state.png"
          alt={t('title')}
          width={180}
          height={180}
          className="w-40 h-40 md:w-48 md:h-48 object-contain select-none pointer-events-none"
          priority
        />

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
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
          className="mt-2"
        >
          <Icons name="home" />
          {t('backHome')}
        </Button>
      </div>
    </div>
  );
}
