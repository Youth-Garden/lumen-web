'use client';

import { useState } from 'react';
import { useGetArticleById } from '../hooks';
import { Icons } from '@lumen/uikit/icons';
import { Button } from '@lumen/uikit/components';
import { useRouter } from 'next/navigation';
import {
  TranslationPopover,
} from './translation-popover';
import { useTranslations } from 'next-intl';

export const ArticleReader = ({ articleId }: { articleId: string }) => {
  const t = useTranslations('Reading');
  const { data: article, isLoading, isError } = useGetArticleById(articleId);
  const router = useRouter();

  const [selection, setSelection] = useState<{ text: string; x: number; y: number } | null>(null);

  const handleMouseUp = () => {
    const textSelection = window.getSelection();
    if (!textSelection || textSelection.isCollapsed) {
      setSelection(null);
      return;
    }

    const text = textSelection.toString().trim();

    // Only translate if word count is reasonable (e.g. max 50 words to avoid huge blocks)
    if (text.length > 0 && text.split(/\s+/).length <= 50) {
      const range = textSelection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      setSelection({
        text,
        x: rect.left + rect.width / 2,
        y: rect.top,
      });
    } else {
      setSelection(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Icons
          name="loader-2"
          className="h-10 w-10 animate-spin text-teal-600"
        />
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 pt-20 text-slate-500">
        <p>{t('failedLoadArticle')}</p>
        <Button variant="outline" onClick={() => router.back()}>
          {t('goBack')}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Button
        variant="ghost"
        className="mb-8 pl-0 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        onClick={() => router.back()}
      >
        <Icons name="chevron-left" className="mr-2 h-4 w-4" />
        {t('backToArticles')}
      </Button>

      <article className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-12">
        <div className="mb-10 border-b border-slate-100 pb-8 dark:border-slate-800">
          <div className="mb-4 flex items-center justify-between">
            <span className="inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 dark:bg-teal-900/30 dark:text-teal-400">
              <Icons name="tag" className="mr-1 h-3 w-3" /> {t('vocabBuilding')}
            </span>
            <span className="inline-flex items-center text-sm text-slate-500">
              <Icons name="clock" className="mr-1 h-4 w-4" />{' '}
              {new Date(article.createdAt).toLocaleDateString()}
            </span>
          </div>

          <h1 className="mb-4 text-3xl font-extrabold leading-tight text-slate-900 dark:text-slate-50 md:text-5xl">
            {article.title}
          </h1>

          <p className="text-lg text-slate-500 dark:text-slate-400">
            {t('instruction')}
          </p>
        </div>

        {/* The readable content area */}
        <div
          className="prose prose-lg prose-slate dark:prose-invert max-w-none font-serif leading-loose"
          onMouseUp={handleMouseUp}
        >
          {article.content.split('\n').map((paragraph, idx) =>
            paragraph.trim() ? (
              <p key={idx} className="mb-6 text-slate-800 dark:text-slate-200">
                {paragraph}
              </p>
            ) : null,
          )}
        </div>
        {selection && (
          <div
            className="fixed z-50 animate-in fade-in zoom-in-95 duration-200"
            style={{
              left: selection.x,
              top: selection.y - 40,
              transform: 'translateX(-50%)',
            }}
          >
            <TranslationPopover text={selection.text} compact />
          </div>
        )}
      </article>
    </div>
  );
};
