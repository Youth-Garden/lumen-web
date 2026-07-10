'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { ArticleReader } from '@/features/reading/components/article-reader';

export const ArticleReaderPage = () => {
  const params = useParams<{ id: string }>();

  if (!params.id) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50/50 p-4 py-8 dark:bg-slate-950/50 md:p-8">
      <ArticleReader articleId={params.id} />
    </div>
  );
};
