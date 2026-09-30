'use client';

import Image from 'next/image';
import { useLocale } from '@/shared/hooks';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo } from 'react';
import { useLocalStorage } from '@lumen/hooks';
import { useHeatmap, useProgressDashboard } from '@/features/dashboard/hooks';
import { computeWeeklyTrackerDays } from '@/features/dashboard/utils/streak-tracker.utils';
import { MissedWordStat } from '@/features/study/types/study.types';
import { WordDetailTrigger } from '@/features/vocabulary/components/word-detail-trigger';
import { StreakFreezeIcon, StreakIcon } from '@/shared/components/streak-icon';
import { Locale } from '@/shared/types';
import { i18nText } from '@/shared/utils';
import { Badge, Button } from '@lumen/uikit/components';
import { cn } from '@lumen/uikit/utils';

interface StudyCompletedProps {
  missedWords?: MissedWordStat[];
  onClose: () => void;
}

export function StudyCompleted({
  missedWords = [],
  onClose,
}: StudyCompletedProps) {
  const t = useTranslations('Vocabulary.Study');
  const locale = useLocale();

  const { data: progressData } = useProgressDashboard();
  const { data: heatmapData } = useHeatmap();
  const streak = Math.max(progressData?.streak || 1, 1);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [lastCompletedStreakDate, setLastCompletedStreakDate] = useLocalStorage<
    string | null
  >('lumen_last_completed_streak_date', null);

  const isFirstSessionToday = lastCompletedStreakDate !== todayStr;

  useEffect(() => {
    if (isFirstSessionToday) {
      setLastCompletedStreakDate(todayStr);
    }
  }, [isFirstSessionToday, setLastCompletedStreakDate, todayStr]);

  const handleFinish = () => {
    onClose();
  };

  const weeklyDays = useMemo(() => {
    return computeWeeklyTrackerDays(
      heatmapData,
      progressData?.todayStudyMinutes || 0,
      progressData?.dailyGoalMinutes || 15,
      locale,
      progressData?.streakFreezes || 0,
      true, // forceTodayCompleted = true for finished session screen
    );
  }, [
    heatmapData,
    progressData?.todayStudyMinutes,
    progressData?.dailyGoalMinutes,
    progressData?.streakFreezes,
    locale,
  ]);

  const renderMissedWordsSection = () => {
    if (missedWords.length === 0) return null;
    return (
      <div className="w-full text-left space-y-2.5 pt-4 mt-2">
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          {t('needReviewWords')}
        </h4>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {missedWords.map((item) => {
            const def = item.card.definitions?.[0];
            const meaning = i18nText(def?.definition, locale) || item.card.term;
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
    );
  };

  if (isFirstSessionToday) {
    return (
      <div className="flex flex-col items-center justify-center p-4 sm:p-6 max-w-md mx-auto text-center space-y-5 animate-in fade-in-50 zoom-in-95 duration-300">
        {/* Standalone 3D Streak Flame Icon (NO background wrapper) */}
        <StreakIcon size={64} className="mx-auto select-none shrink-0" />

        {/* Streak Title with Primary Color */}
        <div className="space-y-1">
          <h3 className="text-xl font-extrabold text-foreground tracking-tight">
            {t.rich('streakActiveTitle', {
              streak,
              highlight: (chunks) => (
                <span className="text-primary font-black">{chunks}</span>
              ),
            })}
          </h3>
        </div>

        {/* 7 Weekly Day Capsule Pills Row */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 w-full max-w-sm mx-auto my-1">
          {weeklyDays.map((item) => {
            const isTodayMet = item.isToday && item.isGoalMet;
            const isCompleted = item.status === 'completed' || isTodayMet;
            const isFrozen = item.status === 'frozen';
            const isMissed = item.status === 'missed';

            return (
              <div
                key={item.dateStr}
                className={cn(
                  'flex flex-col items-center justify-between py-2.5 sm:py-3 px-1 min-h-[68px] sm:min-h-[76px] rounded-2xl transition-all duration-200',
                  isCompleted && 'bg-emerald-500/10 dark:bg-emerald-500/15',
                  isFrozen && 'bg-blue-500/10 dark:bg-blue-500/15',
                  isMissed && 'bg-rose-500/10 dark:bg-rose-500/15',
                  !isCompleted &&
                    !isFrozen &&
                    !isMissed &&
                    !item.isToday &&
                    'bg-muted/40',
                )}
              >
                {/* Larger 3D Streak / Freeze Icon */}
                <div className="h-6 w-6 flex items-center justify-center">
                  {isCompleted ? (
                    <StreakIcon size={24} />
                  ) : isFrozen ? (
                    <StreakFreezeIcon size={24} />
                  ) : isMissed ? (
                    <span className="text-sm font-black text-rose-500 dark:text-rose-400 font-heading leading-none select-none">
                      !
                    </span>
                  ) : (
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                  )}
                </div>

                {/* Day Label */}
                <span
                  className={cn(
                    'text-[11px] font-semibold tracking-tight mt-1 transition-colors',
                    item.isToday
                      ? 'text-primary font-bold'
                      : isCompleted || isFrozen || isMissed
                        ? 'text-foreground'
                        : 'text-muted-foreground',
                  )}
                >
                  {item.dayLabel}
                </span>
              </div>
            );
          })}
        </div>

        {/* Missed words section if any */}
        {renderMissedWordsSection()}

        {/* Standard Action Button */}
        <div className="pt-2 w-full max-w-xs sm:max-w-sm mx-auto">
          <Button
            variant="default"
            size="lg"
            className="w-full cursor-pointer"
            onClick={handleFinish}
          >
            {t('continue')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 sm:p-8 max-w-md mx-auto text-center space-y-6 animate-in fade-in-50 zoom-in-95 duration-300">
      {/* Standalone 3D Graduation Certificate Image */}
      <div className="relative flex items-center justify-center">
        <Image
          src="/images/common/completed.png"
          alt="Session Completed"
          width={140}
          height={140}
          className="w-32 h-32 object-contain drop-shadow-md animate-in zoom-in-75 duration-300"
          priority
        />
      </div>

      <div className="space-y-1">
        <h3 className="text-2xl font-black text-foreground tracking-tight">
          {t('congratsSession')}
        </h3>
      </div>

      {/* Missed words section if any */}
      {renderMissedWordsSection()}

      {/* Standard Action Button */}
      <div className="pt-2 w-full max-w-xs sm:max-w-sm mx-auto">
        <Button
          variant="default"
          size="lg"
          className="w-full cursor-pointer"
          onClick={handleFinish}
        >
          {t('finish')}
        </Button>
      </div>
    </div>
  );
}
