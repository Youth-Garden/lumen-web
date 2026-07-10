'use client';

import React from 'react';
import { DictationList } from '@/features/dictation/components/dictation-list';
import { Icons } from '@lumen/uikit/icons';
import { useTranslations } from 'next-intl';

export const DictationListPage = () => {
  const t = useTranslations('Dictation');

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
            <Icons name="headphones" className="h-8 w-8 text-primary" />
            {t('dailyDictation.title')}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {t('dailyDictation.description')}
          </p>
        </div>
      </div>
      <div className="mt-8">
        <DictationList />
      </div>
    </div>
  );
};
