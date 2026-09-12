'use client';

import { useDueFlashcards } from '@/features/study/hooks';
import { RouteEnum } from '@/shared/constants';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { DailyGoalWidget } from '../components/daily-goal-widget';
import { HeatmapCalendar } from '../components/heatmap-calendar';
import { useHeatmap, useProgressDashboard } from '../hooks';

export function OverviewPage() {
  const t = useTranslations('Dashboard.Overview');
  const { data: progressData } = useProgressDashboard();
  const { data: heatmapData, isLoading: heatmapLoading } = useHeatmap();
  const { data: dueFlashcards } = useDueFlashcards();
  const dueCount = dueFlashcards?.data?.length || 0;

  const memoryLevels = [
    { label: 'Just learned', count: 8 },
    { label: 'Temporary', count: 18 },
    { label: 'Lasting', count: 42 },
    { label: 'Memorized', count: 65 },
    { label: 'Proficient', count: 180 },
  ];

  const totalLearnedWords = memoryLevels.reduce(
    (acc, curr) => acc + curr.count,
    0,
  );

  const missedWords = [
    {
      word: 'glimpse',
      partOfSpeech: 'noun',
      definition: 'a brief or partial view',
      errorRate: '33%',
    },
    {
      word: 'fulfill',
      partOfSpeech: 'verb',
      definition: 'to achieve or realize something',
      errorRate: '33%',
    },
    {
      word: 'substitution',
      partOfSpeech: 'noun',
      definition: 'the action of replacing someone or something',
      errorRate: '31%',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-heading font-bold tracking-tight text-foreground">
            Vocabulary Overview
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Track your learned words, spaced repetition schedule, and daily
            streak.
          </p>
        </div>
      </div>

      {/* Main Grid: Left Column (Word Retention + Missed Words), Right Column (Spaced Repetition & Daily Goal) */}
      <div className="grid gap-6 md:grid-cols-12">
        {/* Left Column: 8 cols */}
        <div className="md:col-span-8 flex flex-col gap-6">
          {/* Learned Words Card */}
          <Card className="rounded-3xl border-none bg-card shadow-xs overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-heading font-black text-primary">
                    {totalLearnedWords}
                  </span>
                  <span className="text-sm font-semibold text-muted-foreground">
                    learned words
                  </span>
                </div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                  Active Retention
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 pt-2">
              {/* Retention Circles */}
              <div className="grid grid-cols-5 gap-2 text-center">
                {memoryLevels.map((lvl, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-muted/30"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {lvl.count}
                    </div>
                    <span className="text-[11px] font-medium text-muted-foreground truncate w-full">
                      {lvl.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link href={RouteEnum.FLASHCARD_REVIEW} className="flex-1">
                  <Button className="w-full">
                    <Icons name="sparkles" />
                    <span>Review Pairing ({dueCount > 0 ? dueCount : 15} words)</span>
                  </Button>
                </Link>
                <Link href={RouteEnum.FLASHCARD_REVIEW} className="flex-1">
                  <Button
                    variant="secondary"
                    className="w-full"
                  >
                    <Icons name="book-open" />
                    <span>Flashcards Mode</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Frequently Missed Words */}
          <Card className="rounded-3xl border-none bg-card shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <Icons
                    name="alert-circle"
                    className="h-4 w-4 text-amber-500"
                  />
                  Frequently Missed Words
                </CardTitle>
                <span className="text-xs text-muted-foreground font-medium">
                  Auto-targeted
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {missedWords.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col justify-between p-3.5 rounded-2xl bg-muted/30 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-foreground">
                        {item.word}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400">
                        Error: {item.errorRate}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      <span className="italic font-medium">
                        ({item.partOfSpeech})
                      </span>{' '}
                      {item.definition}
                    </p>
                  </div>
                ))}
              </div>
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
