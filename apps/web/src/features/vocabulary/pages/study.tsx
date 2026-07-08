'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from '@lumen/uikit/components';
import { useDueFlashcardsQuery } from '@/features/vocabulary/hooks/queries';
import { useReviewFlashcardMutation } from '@/features/vocabulary/hooks/mutations';
import { FlashcardReview } from '../components/flashcard-review';
import { RouteEnum } from '@/shared/constants';

export function StudyPage() {
  const t = useTranslations('Vocabulary.Study');
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: dueFlashcardsResponse, isLoading, isError } = useDueFlashcardsQuery();
  const { mutateAsync: reviewFlashcard, isPending: isReviewing } = useReviewFlashcardMutation();

  const dueFlashcards = dueFlashcardsResponse?.data || [];
  const currentFlashcard = dueFlashcards[currentIndex];
  const isFinished = currentIndex >= dueFlashcards.length && dueFlashcards.length > 0;

  const handleGrade = async (grade: number) => {
    if (!currentFlashcard) return;

    try {
      await reviewFlashcard({
        flashcardId: currentFlashcard.flashcardId,
        grade,
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
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">{t('loading', { fallback: 'Loading due flashcards...' })}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] w-full text-destructive">
        <p>{t('error', { fallback: 'Failed to load flashcards. Please try again later.' })}</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          {t('retry', { fallback: 'Retry' })}
        </Button>
      </div>
    );
  }

  if (dueFlashcards.length === 0 || isFinished) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] w-full animate-in fade-in zoom-in duration-500">
        <div className="bg-primary/10 p-6 rounded-full mb-6">
          <CheckCircle2 className="h-20 w-20 text-primary" />
        </div>
        <h2 className="text-3xl font-bold mb-4">{t('allCaughtUp', { fallback: 'You\'re all caught up!' })}</h2>
        <p className="text-muted-foreground text-lg mb-8 max-w-md text-center">
          {t('allCaughtUpDescription', { fallback: 'Great job! You have reviewed all your due flashcards for today. Take a break or learn some new words.' })}
        </p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => router.push(RouteEnum.VOCABULARY)}>
            {t('backToWords', { fallback: 'Learn New Words' })}
          </Button>
          <Button onClick={() => router.push(RouteEnum.DECKS)}>
            {t('backToDecks', { fallback: 'Go to Decks' })}
          </Button>
        </div>
      </div>
    );
  }

  const progress = ((currentIndex) / dueFlashcards.length) * 100;

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full pb-10">
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" className="gap-2" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          {t('back', { fallback: 'Back' })}
        </Button>
        
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium text-muted-foreground mb-2">
            {currentIndex} / {dueFlashcards.length} {t('cards', { fallback: 'cards' })}
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
