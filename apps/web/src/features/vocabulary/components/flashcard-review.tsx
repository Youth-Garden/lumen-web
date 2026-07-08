'use client';

import { useState } from 'react';
import { Card, CardContent, Button, Skeleton } from '@lumen/uikit/components';
import { Volume2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { DueFlashcard } from '@/services/vocabulary';
import { useVocabularyWordDetailQuery } from '@/features/vocabulary/hooks/queries';
import { cn } from '@lumen/uikit/utils';

interface FlashcardReviewProps {
  flashcard: DueFlashcard;
  onGrade: (grade: number) => void;
  isSubmitting?: boolean;
}

export function FlashcardReview({ flashcard, onGrade, isSubmitting }: FlashcardReviewProps) {
  const t = useTranslations('Vocabulary.Study');
  const [isFlipped, setIsFlipped] = useState(false);

  // Fetch word details when flipped
  const { data: wordDetailResponse, isLoading } = useVocabularyWordDetailQuery(flashcard.wordId, {
    enabled: isFlipped,
  });

  const word = wordDetailResponse?.data;

  const playAudio = (url: string) => {
    const audio = new Audio(url);
    audio.play().catch(console.error);
  };

  const handleFlip = () => {
    if (!isFlipped) setIsFlipped(true);
  };

  const handleGrade = (grade: number) => {
    onGrade(grade);
    // Reset flip state after a slight delay to allow transition, or let parent unmount it
    setTimeout(() => setIsFlipped(false), 200);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-12">
      <Card 
        className={cn(
          "w-full min-h-[500px] cursor-pointer transition-all duration-300 ease-in-out border-2 overflow-hidden",
          isFlipped ? "border-primary shadow-xl" : "border-border hover:border-primary/50 hover:shadow-lg"
        )}
        onClick={handleFlip}
      >
        <CardContent className="flex flex-col items-center justify-center min-h-[500px] h-full p-12 text-center relative">
          <h2 className="text-[clamp(3rem,8vw,6rem)] font-black tracking-tighter leading-none mb-6 text-foreground">{flashcard.term}</h2>
          
          {!isFlipped && (
            <p className="text-muted-foreground/60 mt-12 text-lg font-medium tracking-wide uppercase">
              {t('tapToFlip', { fallback: 'Tap to flip' })}
            </p>
          )}

          {isFlipped && (
            <div className="flex flex-col items-center w-full animate-in fade-in zoom-in-95 duration-200">
              {isLoading ? (
                <div className="space-y-4 w-full flex flex-col items-center">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-16 w-3/4" />
                </div>
              ) : word ? (
                <>
                  <div className="flex items-center gap-2 mb-6">
                    {word.phonetic && <span className="text-xl text-muted-foreground">{word.phonetic}</span>}
                    {word.audioUrl && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => {
                          e.stopPropagation();
                          playAudio(word.audioUrl!);
                        }}
                      >
                        <Volume2 className="h-5 w-5 text-primary" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-10 w-full text-left mt-8 max-w-2xl mx-auto">
                    {word.definitions.slice(0, 2).map((def, idx) => (
                      <div key={def.id || idx} className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-3">
                          <span className="text-sm font-bold uppercase tracking-widest text-primary px-3 py-1 bg-primary/5 rounded-none border-l-4 border-primary">
                            {def.partOfSpeech}
                          </span>
                          <span className="text-2xl font-semibold text-foreground">{def.translationVi}</span>
                        </div>
                        <p className="text-lg text-muted-foreground leading-relaxed">{def.definitionEn}</p>
                        {def.examples && def.examples.length > 0 && (
                          <div className="pl-6 border-l-2 border-primary/20 pt-2 pb-2">
                            <p className="mt-2 text-sm italic text-slate-500 dark:text-slate-400">
                              &quot;{def.examples[0].sentenceEn}&quot;
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-destructive">Failed to load word details.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className={cn(
        "flex flex-col sm:flex-row justify-center gap-4 w-full transition-all duration-500 ease-out",
        isFlipped ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
      )}>
        <Button 
          variant="outline" 
          size="lg"
          className="flex-1 h-16 text-lg font-bold border-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-none"
          onClick={() => handleGrade(0)}
          disabled={isSubmitting}
        >
          {t('gradeAgain', { fallback: 'Again (1m)' })}
        </Button>
        <Button 
          variant="outline" 
          size="lg"
          className="flex-1 h-16 text-lg font-bold border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white rounded-none"
          onClick={() => handleGrade(3)}
          disabled={isSubmitting}
        >
          {t('gradeHard', { fallback: 'Hard (10m)' })}
        </Button>
        <Button 
          variant="outline" 
          size="lg"
          className="flex-1 h-16 text-lg font-bold border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-none"
          onClick={() => handleGrade(4)}
          disabled={isSubmitting}
        >
          {t('gradeGood', { fallback: 'Good (1d)' })}
        </Button>
        <Button 
          variant="outline" 
          size="lg"
          className="flex-1 h-16 text-lg font-bold border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground rounded-none"
          onClick={() => handleGrade(5)}
          disabled={isSubmitting}
        >
          {t('gradeEasy', { fallback: 'Easy (4d)' })}
        </Button>
      </div>
    </div>
  );
}
