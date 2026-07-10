'use client';

import React from 'react';
import { DictationPlayer } from '@/features/dictation/components/dictation-player';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export const DictationExercisePage = () => {
  const params = useParams<{ id: string }>();
  const t = useTranslations('Dictation');

  if (!params.id) return null;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="mb-6 flex items-center space-x-4">
        <Link
          href="/dashboard/dictation"
          className="text-muted-foreground transition-colors hover:text-primary"
        >
          &larr; {t('backToList')}
        </Link>
      </div>
      <DictationPlayer materialId={params.id} />
    </div>
  );
};
