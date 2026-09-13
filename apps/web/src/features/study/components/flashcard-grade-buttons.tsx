'use client';

import { FlashcardRating } from '@/services/study';
import { Button } from '@lumen/uikit/components';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface FlashcardGradeButtonsProps {
  isFlipped: boolean;
  isSubmitting: boolean;
  onGrade: (rating: FlashcardRating) => void;
}

export function FlashcardGradeButtons({
  isFlipped,
  isSubmitting,
  onGrade,
}: FlashcardGradeButtonsProps) {
  const t = useTranslations('Vocabulary.Review');

  return (
    <AnimatePresence>
      {isFlipped && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col sm:flex-row justify-center gap-4 w-full"
        >
          <Button
            variant="destructive"
            size="lg"
            className="flex-1 h-16 flex flex-col gap-1 text-base font-bold"
            onClick={() => onGrade(FlashcardRating.WRONG)}
            disabled={isSubmitting}
          >
            <span>{t('gradeAgain')}</span>
            <span className="text-xs font-normal opacity-70">
              {t('pressKey', { key: '1' })}
            </span>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="flex-1 h-16 flex flex-col gap-1 text-base font-bold text-amber-600 dark:text-amber-400"
            onClick={() => onGrade(FlashcardRating.CORRECT)}
            disabled={isSubmitting}
          >
            <span>{t('gradeHard')}</span>
            <span className="text-xs font-normal opacity-70">
              {t('pressKey', { key: '2' })}
            </span>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="flex-1 h-16 flex flex-col gap-1 text-base font-bold text-primary"
            onClick={() => onGrade(FlashcardRating.FAST_TRACK_TEMP)}
            disabled={isSubmitting}
          >
            <span>{t('gradeGood')}</span>
            <span className="text-xs font-normal opacity-70">
              {t('pressKey', { key: '3' })}
            </span>
          </Button>
          <Button
            variant="default"
            size="lg"
            className="flex-1 h-16 flex flex-col gap-1 text-base font-bold"
            onClick={() => onGrade(FlashcardRating.FAST_TRACK_KNOWN)}
            disabled={isSubmitting}
          >
            <span>{t('gradeEasy')}</span>
            <span className="text-xs font-normal opacity-70">
              {t('pressKey', { key: '4' })}
            </span>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
