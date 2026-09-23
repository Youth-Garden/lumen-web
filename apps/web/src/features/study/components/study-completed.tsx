'use client';

import { useTranslations } from 'next-intl';

import { MissedWordStat } from '@/features/study/types/study.types';
import { WordDetailTrigger } from '@/features/vocabulary/components/word-detail-trigger';
import { Badge, Button } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';

interface StudyCompletedProps {
  missedWords?: MissedWordStat[];
  onClose: () => void;
}

export function StudyCompleted({
  missedWords = [],
  onClose,
}: StudyCompletedProps) {
  const t = useTranslations('Vocabulary.Study');

  return (
    <div className="flex flex-col items-center justify-center p-6 sm:p-8 max-w-md mx-auto text-center space-y-6 animate-in fade-in-50 zoom-in-95 duration-300">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
          <Icons name="checkCircle2" className="w-8 h-8" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-2xl font-black text-foreground tracking-tight">
          {t('congratsSession')}
        </h3>
      </div>

      {missedWords.length > 0 && (
        <div className="w-full text-left space-y-2.5">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {t('needReviewWords')}
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {missedWords.map((item) => {
              const def = item.card.definitions?.[0];
              const meaning = def?.translationVi || def?.definitionEn || '';
              return (
                <div
                  key={item.card.id}
                  className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-background border border-border/40 hover:border-border transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                    <WordDetailTrigger
                      word={item.card}
                      className="font-bold text-foreground text-xs shrink-0"
                    />
                    <span className="text-muted-foreground truncate">
                      {meaning}
                    </span>
                  </div>
                  <Badge variant="destructive" size="sm">
                    {t('missedCount', { count: item.errorCount })}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="pt-2 w-full">
        <Button
          variant="default"
          size="lg"
          className="w-full cursor-pointer"
          onClick={onClose}
        >
          {t('finish')}
        </Button>
      </div>
    </div>
  );
}
