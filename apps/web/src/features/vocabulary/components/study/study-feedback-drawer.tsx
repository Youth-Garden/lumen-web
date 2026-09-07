'use client';

import Image from 'next/image';
import { Button } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { useTranslations } from 'next-intl';
import type { StudyFeedbackState } from './study.types';

interface StudyFeedbackDrawerProps {
  feedback: StudyFeedbackState | null;
  onContinue: () => void;
}

export function StudyFeedbackDrawer({
  feedback,
  onContinue,
}: StudyFeedbackDrawerProps) {
  const t = useTranslations('Vocabulary.Study');

  if (!feedback || !feedback.isOpen) return null;

  const isCorrect = feedback.isCorrect;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 animate-in slide-in-from-bottom-6 duration-300 pointer-events-auto">
      <div
        className={
          'w-full max-w-2xl mx-auto rounded-t-3xl p-5 sm:p-6 border-t backdrop-blur-xl transition-colors ' +
          (isCorrect
            ? 'bg-[#183a31] border-[#224f42] text-white'
            : 'bg-[#4e1d1f] border-[#6b2527] text-white')
        }
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className={
                  'w-7 h-7 rounded-full flex items-center justify-center shrink-0 ' +
                  (isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400')
                }
              >
                <Icons
                  name={isCorrect ? 'check' : 'x'}
                  className="w-4 h-4 stroke-[3]"
                />
              </div>
              <h3
                className={
                  'text-lg sm:text-xl font-bold tracking-tight ' +
                  (isCorrect ? 'text-emerald-400' : 'text-rose-400')
                }
              >
                {isCorrect ? t('correctTitle') : t('incorrectTitle')}
              </h3>
            </div>

            <Icons
              name="flag"
              className="w-4 h-4 text-muted-foreground/60 cursor-pointer hover:text-muted-foreground transition-colors"
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
              onClick={onContinue}
              className="w-full font-bold cursor-pointer"
            >
              <span>{t('continueSpace')}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
