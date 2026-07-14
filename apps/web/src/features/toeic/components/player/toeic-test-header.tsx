'use client';

import React from 'react';
import { Button } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { useTranslations } from 'next-intl';

interface ToeicTestHeaderProps {
  title: string;
  timeRemainingSeconds: number;
  isSubmitting: boolean;
  isPaused: boolean;
  onFinish: () => void;
  onPauseToggle: () => void;
  onExit: () => void;
}

export const ToeicTestHeader = ({
  title,
  timeRemainingSeconds,
  isSubmitting,
  isPaused,
  onFinish,
  onPauseToggle,
  onExit,
}: ToeicTestHeaderProps) => {
  const t = useTranslations('ToeicTestPlayer');

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const isWarning = timeRemainingSeconds <= 300; // less than 5 minutes

  return (
    <div className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <h1 className="truncate text-lg font-semibold md:text-xl">{title}</h1>

        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2 rounded-full px-4 py-1.5 font-mono text-lg font-medium transition-colors ${
              isWarning
                ? 'animate-pulse bg-destructive/10 text-destructive'
                : 'bg-muted text-foreground'
            }`}
          >
            <Icons name="clock" className="h-5 w-5" />
            <span>{formatTime(timeRemainingSeconds)}</span>
          </div>

          <Button
            onClick={onExit}
            variant="ghost"
            disabled={isSubmitting}
            className="hidden sm:flex text-muted-foreground hover:text-foreground"
          >
            <Icons name="log-out" className="mr-2 h-4 w-4" />
            {t('exit')}
          </Button>
          <Button
            onClick={onPauseToggle}
            variant="outline"
            disabled={isSubmitting}
          >
            <Icons
              name={isPaused ? 'play' : 'pause'}
              className="mr-2 h-4 w-4"
            />
            {isPaused ? t('resumeTest') : t('pauseTest')}
          </Button>
          <Button
            onClick={onFinish}
            disabled={isSubmitting}
            className="min-w-[100px]"
          >
            {isSubmitting ? (
              <Icons name="loader-2" className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {t('finishTest')}
          </Button>
        </div>
      </div>
    </div>
  );
};
