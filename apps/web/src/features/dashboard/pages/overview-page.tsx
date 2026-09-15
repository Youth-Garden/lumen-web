'use client';

import { useDueFlashcards } from '@/features/study/hooks';
import { useVocabularyOverview } from '@/features/vocabulary/hooks';
import { Button } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { usePortal } from '@lumen/uikit/portal';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { DailyGoalDialog } from '../components/daily-goal-dialog';
import { HeatmapCalendar } from '../components/heatmap-calendar';
import {
  MemoryRetentionCard,
  type MemoryLevelItem,
} from '../components/memory-retention-card';
import { StudyMetricsCards } from '../components/study-metrics-cards';
import { WeeklyStudyChart } from '../components/weekly-study-chart';
import { useHeatmap, useProgressDashboard } from '../hooks';

export function OverviewPage() {
  const t = useTranslations('Dashboard.Overview');
  const [presentDailyGoalDialog] = usePortal(DailyGoalDialog);

  const { data: progressData, isLoading: progressLoading } =
    useProgressDashboard();
  const { data: heatmapData, isLoading: heatmapLoading } = useHeatmap();
  const { data: dueFlashcards, isLoading: dueLoading } = useDueFlashcards();
  const { data: overviewRes, isLoading: overviewLoading } =
    useVocabularyOverview();

  const overview = overviewRes?.data;
  const dueCount = useMemo(() => {
    if (!dueFlashcards?.data) return 0;
    return dueFlashcards.data.filter(
      (card) =>
        Boolean(card.nextReviewAt) ||
        (card.level ?? 0) > 0 ||
        (card.learningStep ?? 0) > 0,
    ).length;
  }, [dueFlashcards?.data]);

  const totalLearnedWords = overview?.totalLearnedWords ?? 0;
  const streak = progressData?.streak ?? 0;
  const todayStudyMinutes = progressData?.todayStudyMinutes ?? 0;
  const dailyGoalMinutes = progressData?.dailyGoalMinutes ?? 15;

  const isStatsLoading = progressLoading || overviewLoading || dueLoading;

  const memoryLevels: MemoryLevelItem[] = useMemo(() => {
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

  return (
    <div className="space-y-6 pb-28">
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

        <Button
          variant="outline"
          onClick={() => presentDailyGoalDialog()}
          className="self-start sm:self-auto"
        >
          <Icons name="target" className="h-4 w-4 mr-1.5" />
          {t('setDailyGoal')}
        </Button>
      </div>

      {/* Tier 1: Core Study KPIs (4-Column Bento Row) */}
      <StudyMetricsCards
        streak={streak}
        todayStudyMinutes={todayStudyMinutes}
        dailyGoalMinutes={dailyGoalMinutes}
        totalLearnedWords={totalLearnedWords}
        dueCount={dueCount}
        isLoading={isStatsLoading}
      />

      {/* Tier 2: Asymmetric Bento Row (8 cols vs 4 cols) */}
      <div className="grid gap-6 md:grid-cols-12 items-stretch">
        <div className="md:col-span-8 flex flex-col">
          <WeeklyStudyChart
            heatmapData={heatmapData}
            dailyGoalMinutes={dailyGoalMinutes}
            todayStudyMinutes={todayStudyMinutes}
            isLoading={isStatsLoading}
          />
        </div>

        <div className="md:col-span-4 flex flex-col">
          <MemoryRetentionCard
            levels={memoryLevels}
            totalLearnedWords={totalLearnedWords}
            dueCount={dueCount}
            isLoading={overviewLoading}
          />
        </div>
      </div>

      {/* Tier 3: Wide Bento Card with Integrated Activity Insights (Full Width) */}
      <div className="w-full">
        <HeatmapCalendar
          data={heatmapData || []}
          isLoading={heatmapLoading}
          todayStudyMinutes={todayStudyMinutes}
          streak={streak}
        />
      </div>
    </div>
  );
}
