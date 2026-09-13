'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useMemo } from 'react';

import { useDueFlashcards } from '@/features/study/hooks';
import { useVocabularyOverview } from '@/features/vocabulary/hooks';
import { PronunciationAccent } from '@/services/vocabulary';
import { RouteEnum } from '@/shared/constants';
import { usePronunciation } from '@/shared/hooks';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';

import { DailyGoalWidget } from '../components/daily-goal-widget';
import { HeatmapCalendar } from '../components/heatmap-calendar';
import { useHeatmap, useProgressDashboard } from '../hooks';

export function OverviewPage() {
  const t = useTranslations('Dashboard.Overview');
  useProgressDashboard();
  const { data: heatmapData, isLoading: heatmapLoading } = useHeatmap();
  const { data: dueFlashcards, isLoading: dueLoading } = useDueFlashcards();
  const { data: overviewRes, isLoading: overviewLoading } =
    useVocabularyOverview();
  const { playPronunciation, isPlaying } = usePronunciation();

  const overview = overviewRes?.data;
  const dueCount = dueFlashcards?.data?.length || 0;

  const totalLearnedWords = overview?.totalLearnedWords ?? 0;

  const memoryLevels = useMemo(() => {
    const rawLevels = overview?.memoryLevels || [];
    return [
      {
        level: 1,
        label: t('stageLevel1'),
        count: rawLevels.find((item) => item.level === 1)?.count ?? 0,
      },
      {
        level: 2,
        label: t('stageLevel2'),
        count: rawLevels.find((item) => item.level === 2)?.count ?? 0,
      },
      {
        level: 3,
        label: t('stageLevel3'),
        count: rawLevels.find((item) => item.level === 3)?.count ?? 0,
      },
      {
        level: 4,
        label: t('stageLevel4'),
        count: rawLevels.find((item) => item.level === 4)?.count ?? 0,
      },
      {
        level: 5,
        label: t('stageLevel5'),
        count: rawLevels.find((item) => item.level >= 5)?.count ?? 0,
      },
    ];
  }, [overview?.memoryLevels, t]);

  const missedWords = useMemo(
    () => overview?.frequentlyMissedWords || [],
    [overview?.frequentlyMissedWords],
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-heading font-bold tracking-tight text-foreground">
            {t('pageTitle')}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {t('pageSubtitle')}
          </p>
        </div>
      </div>

      {/* Main Grid: Left Column (Word Retention + Missed Words), Right Column (Daily Goal & Heatmap) */}
      <div className="grid gap-6 md:grid-cols-12">
        {/* Left Column: 8 cols */}
        <div className="md:col-span-8 flex flex-col gap-6">
          {/* Learned Words Card */}
          <Card className="rounded-3xl border-none bg-card shadow-xs overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  {overviewLoading ? (
                    <Skeleton className="h-9 w-16 rounded-lg" />
                  ) : (
                    <span className="text-3xl font-heading font-black text-primary">
                      {totalLearnedWords}
                    </span>
                  )}
                  <span className="text-sm font-semibold text-muted-foreground">
                    {t('learnedWords')}
                  </span>
                </div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                  {t('activeRetention')}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 pt-2">
              <div className="grid grid-cols-5 gap-2 text-center">
                {memoryLevels.map((lvl) => (
                  <div
                    key={lvl.level}
                    className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-background"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {overviewLoading ? (
                        <Skeleton className="h-4 w-4 rounded-full" />
                      ) : (
                        lvl.count
                      )}
                    </div>
                    <span className="text-[11px] font-medium text-muted-foreground truncate w-full">
                      {lvl.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  render={<Link href={RouteEnum.FLASHCARD_REVIEW} />}
                  className="flex-1 w-full"
                >
                  <Icons name="sparkles" />
                  <span>
                    {dueLoading
                      ? t('reviewCards')
                      : dueCount > 0
                        ? t('reviewPairing', { count: dueCount })
                        : t('reviewPairingNoWords')}
                  </span>
                </Button>
                <Button
                  render={<Link href={RouteEnum.FLASHCARD_REVIEW} />}
                  variant="secondary"
                  className="flex-1 w-full"
                >
                  <Icons name="book-open" />
                  <span>{t('flashcardsMode')}</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Frequently Missed Words Card */}
          <Card className="rounded-3xl border-none bg-card shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <Icons
                    name="alert-circle"
                    className="h-4 w-4 text-amber-500"
                  />
                  {t('frequentlyMissedWords')}
                </CardTitle>
                <span className="text-xs text-muted-foreground font-medium">
                  {t('autoTargeted')}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {overviewLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Skeleton className="h-24 rounded-2xl" />
                  <Skeleton className="h-24 rounded-2xl" />
                  <Skeleton className="h-24 rounded-2xl" />
                </div>
              ) : missedWords.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center space-y-1.5">
                  <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-1">
                    <Icons name="check" className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {t('noMissedWords')}
                  </span>
                  <p className="text-xs text-muted-foreground max-w-sm">
                    {t('noMissedWordsDesc')}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {missedWords.map((item) => (
                    <div
                      key={item.flashcardId || item.wordId}
                      className="flex flex-col justify-between p-3.5 rounded-2xl bg-background space-y-2"
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="font-bold text-sm text-foreground truncate">
                            {item.term}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            type="button"
                            onClick={() =>
                              playPronunciation({
                                term: item.term,
                                accent: PronunciationAccent.US,
                                audioUrl: item.audioUrl,
                                audioUsUrl: item.audioUsUrl,
                              })
                            }
                            disabled={isPlaying}
                            aria-label={`Pronounce ${item.term}`}
                          >
                            <Icons name="volume-2" className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 shrink-0">
                          {t('errorRate', { rate: item.errorRate })}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {item.partOfSpeech && (
                          <span className="italic font-medium text-primary mr-1">
                            ({item.partOfSpeech})
                          </span>
                        )}
                        {item.definition}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: 4 cols */}
        <div className="md:col-span-4 flex flex-col gap-6">
          <DailyGoalWidget />
          <HeatmapCalendar data={heatmapData} isLoading={heatmapLoading} />
        </div>
      </div>
    </div>
  );
}
