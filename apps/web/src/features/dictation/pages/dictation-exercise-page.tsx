import React from 'react';
import { DictationPlayer } from '@/features/dictation/components/dictation-player';
import { useDictationMaterial } from '@/features/dictation/hooks';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Skeleton } from '@lumen/uikit/components';

export const DictationExercisePage = () => {
  const params = useParams<{ id: string }>();
  const t = useTranslations('Dictation');
  const { data: material, isLoading } = useDictationMaterial(params.id || '');

  if (!params.id) return null;

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-96 w-full max-w-3xl mx-auto rounded-3xl mt-6" />
      </div>
    );
  }

  const title = material?.data?.title || 'Dictation Practice';
  const audioUrl = material?.data?.mediaUrl;
  const transcripts = material?.data?.transcripts || [];

  const sentences = transcripts.map((t, idx) => ({
    id: t.id || String(idx),
    text: t.text || '',
    startTime: t.startTime,
    endTime: t.endTime,
  }));

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="mb-6 flex items-center space-x-4">
        <Link
          href="/dashboard/dictation"
          className="text-muted-foreground transition-colors hover:text-primary font-medium text-sm flex items-center gap-1"
        >
          &larr; {t('backToList') || 'Back to List'}
        </Link>
      </div>
      <DictationPlayer
        title={title}
        audioUrl={audioUrl}
        sentences={sentences.length > 0 ? sentences : [{ id: '1', text: 'Listen and practice your dictation skills.' }]}
      />
    </div>
  );
};
