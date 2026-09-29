'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { Icons } from '@lumen/uikit/icons';
import { Button, OpenEffect } from '@lumen/uikit/components';
import { useCounter } from '@lumen/hooks';
import { useDueWords, useReviewFlashcard } from '@/features/study/hooks';
import { FlashcardReview } from '@/features/study/components/flashcard-review';
import { RouteEnum } from '@/shared/constants';
import { FlashcardRating } from '@/services/study';
import { useSetBreadcrumb } from '@/shared/hooks';

import { useSearchParams } from 'next/navigation';

export function StudyPage() {
  const t = useTranslations('Vocabulary.Study');
  const tVocab = useTranslations('Vocabulary.Folders');
  const router = useRouter();
  const searchParams = useSearchParams();
  const folderId = searchParams.get('folderId') || undefined;
  const limit = searchParams.get('limit')
    ? parseInt(searchParams.get('limit')!, 10)
    : undefined;

  const [currentIndex, { increment: nextIndex }] = useCounter(0);

  useSetBreadcrumb(
    useMemo(
      () => [
        { label: tVocab('title'), href: RouteEnum.VOCABULARY },
        { label: t('practice') },
      ],
      [tVocab, t],
    ),
  );

  const {
    data: dueWordsResponse,
    isLoading,
    isError,
  } = useDueWords({ folderId, limit });
  const { mutateAsync: reviewFlashcard, isPending: isReviewing } =
    useReviewFlashcard();

  const dueWords = dueWordsResponse?.data || [];
  const currentWord = dueWords[currentIndex];
  const isFinished = currentIndex >= dueWords.length && dueWords.length > 0;

  const handleGrade = async (grade: FlashcardRating) => {
    if (!currentWord) return;

    try {
      await reviewFlashcard({
        flashcardId: currentWord.flashcardId,
        quality: grade,
      });
      nextIndex();
    } catch (error) {
      console.error('Failed to review flashcard:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] w-full">
        <Icons
          name="loader-2"
          className="h-10 w-10 animate-spin text-primary"
        />
        <p className="mt-4 text-muted-foreground">{t('loading')}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] w-full text-destructive">
        <p>{t('error')}</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          {t('retry')}
        </Button>
      </div>
    );
  }

  if (dueWords.length === 0 || isFinished) {
    return (
      <OpenEffect
        variant="grow"
        className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] w-full"
      >
        <div className="bg-primary/10 p-6 rounded-full mb-6">
          <Icons name="check-circle" className="h-20 w-20 text-primary" />
        </div>
        <h2 className="text-3xl font-bold mb-4">{t('allCaughtUp')}</h2>
        <p className="text-muted-foreground text-lg mb-8 max-w-md text-center">
          {t('allCaughtUpDescription')}
        </p>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => router.push(RouteEnum.VOCABULARY)}
          >
            {t('backToWords')}
          </Button>
          <Button onClick={() => router.push(RouteEnum.VOCABULARY)}>
            {t('backToFolders')}
          </Button>
        </div>
      </OpenEffect>
    );
  }

  const progress = (currentIndex / dueWords.length) * 100;

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full pb-10">
      <div className="flex items-center justify-end mb-8">
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium text-muted-foreground mb-2">
            {currentIndex} / {dueWords.length} {t('cards')}
          </span>
          <div className="h-2.5 w-48 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {currentWord && (
          <FlashcardReview
            key={currentWord.flashcardId}
            flashcard={currentWord}
            onGrade={handleGrade}
            isSubmitting={isReviewing}
          />
        )}
      </div>
    </div>
  );
}
