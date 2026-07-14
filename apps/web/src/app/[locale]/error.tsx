'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import { Button } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('Error');

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex max-w-md flex-col items-center space-y-6"
      >
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10">
          <Icons name="info" className="h-12 w-12 text-destructive" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">500</h1>
          <h2 className="text-2xl font-semibold tracking-tight">
            {t('title')}
          </h2>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>
        <div className="mt-8 flex gap-4">
          <Button onClick={() => reset()} size="lg" className="gap-2">
            <Icons name="undo" className="h-4 w-4" />
            {t('tryAgain')}
          </Button>
          <Button
            onClick={() => {
              window.location.href = '/';
            }}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <Icons name="home" className="h-4 w-4" />
            {t('backHome')}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
