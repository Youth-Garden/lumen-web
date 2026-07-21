'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Icons } from '@lumen/uikit/icons';
import { Button } from '@lumen/uikit/components';
import { useDueFlashcards } from '@/features/vocabulary/hooks';
import { useReviewFlashcard } from '@/features/vocabulary/hooks';
import { FlashcardReview } from '../components/flashcard-review';
import { RouteEnum } from '@/shared/constants';
import { OpenEffect } from '@lumen/uikit/components';
import { FlashcardRating } from '@/services/vocabulary/vocabulary.types';

import { useSearchParams } from 'next/navigation';

export function StudyPage() {
  const t = useTranslations('Vocabulary.Study');
  const router = useRouter();
  const searchParams = useSearchParams();
  const deckId = searchParams.get('deckId') || undefined;
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined;
  
  const [currentIndex, setCurrentIndex] = useState(0);

  const {
    data: dueFlashcardsResponse,
    isLoading,
    isError,
  } = useDueFlashcards({ deckId, limit });
  const { mutateAsync: reviewFlashcard, isPending: isReviewing } =
    useReviewFlashcard();

  const dueFlashcards = dueFlashcardsResponse?.data || [];
  const currentFlashcard = dueFlashcards[currentIndex];
  const isFinished =
    currentIndex >= dueFlashcards.length && dueFlashcards.length > 0;

  const handleGrade = async (grade: FlashcardRating) => {
    if (!currentFlashcard) return;

    try {
      await reviewFlashcard({
        flashcardId: currentFlashcard.flashcardId,
        quality: grade,
      });
      // Move to next card
      setCurrentIndex((prev) => prev + 1);
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

  if (dueFlashcards.length === 0 || isFinished) {
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
          <Button onClick={() => router.push(RouteEnum.DECKS)}>
            {t('backToDecks')}
          </Button>
        </div>
      </OpenEffect>
    );
  }

  const progress = (currentIndex / dueFlashcards.length) * 100;

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full pb-10">
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" className="gap-2" onClick={() => router.back()}>
          <Icons name="arrow-left" className="h-4 w-4" />
          {t('back')}
        </Button>

        <div className="flex flex-col items-end">
          <span className="text-sm font-medium text-muted-foreground mb-2">
            {currentIndex} / {dueFlashcards.length} {t('cards')}
          </span>
          <div className="h-2 w-48 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {currentFlashcard && (
          <FlashcardReview
            key={currentFlashcard.flashcardId} // Force remount on new card for animation
            flashcard={currentFlashcard}
            onGrade={handleGrade}
            isSubmitting={isReviewing}
          />
        )}
      </div>
    </div>
  );
}
