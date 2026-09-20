'use client';

import type { StudyFeedbackState } from '@/features/study/types/study.types';
import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { PortalProps } from '@lumen/uikit/portal';
import { cn } from '@lumen/uikit/utils';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export interface StudyFeedbackDrawerData {
  feedback: StudyFeedbackState;
  onContinue: () => void;
}

export function StudyFeedbackDrawer({
  isOpen,
  onDismiss,
  data,
}: PortalProps<StudyFeedbackDrawerData>) {
  const t = useTranslations('Vocabulary.Study');
  const feedback = data?.feedback;
  const onContinue = data?.onContinue;

  if (!feedback) return null;

  const isCorrect = feedback.isCorrect;

  const handleContinue = () => {
    onContinue?.();
    onDismiss?.();
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleContinue();
        }
      }}
    >
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className={cn(
          'w-full max-w-2xl mx-auto rounded-t-3xl p-5 sm:p-6 backdrop-blur-xl transition-colors pointer-events-auto gap-0',
          isCorrect ? 'bg-[#183a31] text-white' : 'bg-[#4e1d1f] text-white',
        )}
      >
        <SheetTitle className="sr-only">
          {isCorrect ? t('correctTitle') : t('incorrectTitle')}
        </SheetTitle>
        <SheetDescription className="sr-only">
          {feedback.card.term}
        </SheetDescription>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center shrink-0',
                  isCorrect
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-rose-500/20 text-rose-400',
                )}
              >
                <Icons
                  name={isCorrect ? 'check' : 'x'}
                  className="w-4 h-4 stroke-[3]"
                />
              </div>
              <h3
                className={cn(
                  'text-lg sm:text-xl font-bold tracking-tight',
                  isCorrect ? 'text-emerald-400' : 'text-rose-400',
                )}
              >
                {isCorrect ? t('correctTitle') : t('incorrectTitle')}
              </h3>
            </div>

            <Icons
              name="flag"
              className="w-4 h-4 text-white/40 cursor-pointer hover:text-white/70 transition-colors"
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1 min-w-0 flex-1">
              {!isCorrect && (
                <p className="text-xs font-semibold text-rose-300">
                  {t('correctAnswerLabel')}{' '}
                  <span className="text-emerald-400 font-bold underline underline-offset-2">
                    {feedback.correctAnswer}
                  </span>
                </p>
              )}

              <p className="text-base sm:text-lg font-black text-white underline underline-offset-4 decoration-current/40 truncate">
                {feedback.card.term}
              </p>

              <p className="text-xs sm:text-sm text-white/80 leading-relaxed line-clamp-2">
                {feedback.partOfSpeech && (
                  <span className="italic mr-1 text-white/60">
                    ({feedback.partOfSpeech})
                  </span>
                )}
                {feedback.meaning}
              </p>
            </div>

            {feedback.imageUrl && (
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-black/40 shrink-0 border border-white/10">
                <Image
                  src={feedback.imageUrl}
                  alt={feedback.card.term}
                  fill
                  sizes="80px"
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
          </div>

          <div className="pt-1">
            <Button
              variant="default"
              size="lg"
              onClick={handleContinue}
              className="w-full font-bold cursor-pointer"
            >
              <span>{t('continueSpace')}</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
