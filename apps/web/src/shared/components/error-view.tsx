'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { RouteEnum } from '@/shared/constants';
import { useBreadcrumb } from '@/shared/hooks';
import { Button } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';

export interface ErrorViewProps {
  title?: string;
  subtitle?: string;
  backHomeLabel?: string;
  goBackLabel?: string;
  onReset?: () => void;
  onBackHome?: () => void;
}

export function ErrorView({
  title,
  subtitle,
  backHomeLabel,
  goBackLabel,
  onReset,
  onBackHome,
}: ErrorViewProps) {
  const t = useTranslations('Error');
  const router = useRouter();
  const { clearBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    clearBreadcrumbs();
  }, [clearBreadcrumbs]);

  const displayTitle = title || t('title');
  const displaySubtitle = subtitle || t('subtitle');
  const displayGoBack = goBackLabel || t('goBack');
  const displayBackHome = backHomeLabel || t('backHome');

  const handleGoBack = () => {
    if (onReset) {
      onReset();
    } else {
      router.back();
    }
  };

  const handleBackHome = () => {
    if (onBackHome) {
      onBackHome();
    } else {
      router.push(RouteEnum.DASHBOARD);
    }
  };

  return (
    <main className="flex min-h-[100dvh] w-full flex-col items-center justify-center p-4 text-center">
      <div className="relative flex max-w-md flex-col items-center space-y-6">
        {/* Ambient Glow */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-destructive/10 blur-[80px] rounded-full pointer-events-none -z-10" />

        {/* Standalone 3D Error State Image */}
        <Image
          src="/images/common/error-state.png"
          alt={displayTitle}
          width={180}
          height={180}
          className="w-40 h-40 md:w-48 md:h-48 object-contain select-none pointer-events-none"
          priority
        />

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl text-foreground">
            {displayTitle}
          </h1>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto leading-relaxed">
            {displaySubtitle}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-2 w-full sm:w-auto">
          <Button variant="outline" size="lg" onClick={handleGoBack}>
            <Icons name="arrow-left" />
            <span>{displayGoBack}</span>
          </Button>
          <Button variant="default" size="lg" onClick={handleBackHome}>
            <Icons name="home" />
            <span>{displayBackHome}</span>
          </Button>
        </div>
      </div>
    </main>
  );
}
