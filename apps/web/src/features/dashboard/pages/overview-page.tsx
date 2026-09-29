'use client';

import { useVocabularyOverview } from '@/features/vocabulary/hooks';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { HeatmapCalendar } from '../components/heatmap-calendar';
import { HeroActionCard } from '../components/hero-action-card';
import { HeroStreakCard } from '../components/hero-streak-card';
import {
  MemoryRetentionCard,
  type MemoryLevelItem,
} from '../components/memory-retention-card';
import { StreakMilestoneCard } from '../components/streak-milestone-card';
import { TodayGoalProgressCard } from '../components/today-goal-progress-card';
import { WeeklyGoalTrackerCard } from '../components/weekly-goal-tracker-card';
import { WeeklyStudyChart } from '../components/weekly-study-chart';
import { useHeatmap, useProgressDashboard } from '../hooks';

export function OverviewPage() {
  const t = useTranslations('Dashboard.Overview');

  const {
    data: progressData,
    isLoading: progressLoading,
    isPending: progressPending,
  } = useProgressDashboard();
  const { data: heatmapData, isLoading: heatmapLoading } = useHeatmap();
  const {
    data: overviewRes,
    isLoading: overviewLoading,
    isPending: overviewPending,
  } = useVocabularyOverview();

  const overview = overviewRes?.data;
  const dueCount = overview?.dueCount ?? 0;

  const totalLearnedWords = overview?.totalLearnedWords ?? 0;
  const todayStudyMinutes = progressData?.todayStudyMinutes ?? 0;
  const streak = progressData?.streak ?? 0;
  const dailyGoalMinutes = progressData?.dailyGoalMinutes ?? 15;

  const isStatsLoading =
    progressLoading ||
    overviewLoading ||
    progressPending ||
    overviewPending ||
    !progressData ||
    !overviewRes?.data;

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
      <div>
        <h2 className="text-3xl font-heading font-bold tracking-tight text-foreground">
          {t('pageTitle')}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {t('pageSubtitle')}
        </p>
      </div>

      {/* Tier 1: Action-First Hero Row (3 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
        <HeroStreakCard
          streak={streak}
          todayStudyMinutes={todayStudyMinutes}
          isLoading={isStatsLoading}
        />
        <HeroActionCard
          dueCount={dueCount}
          totalLearnedWords={totalLearnedWords}
          isLoading={isStatsLoading}
        />
        <TodayGoalProgressCard
          todayStudyMinutes={todayStudyMinutes}
          dailyGoalMinutes={dailyGoalMinutes}
          isLoading={isStatsLoading}
        />
      </div>

      {/* Tier 2: Weekly Tracker & Milestone Hub (2-Column Balanced Row) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
        <WeeklyGoalTrackerCard
          heatmapData={heatmapData}
          todayStudyMinutes={todayStudyMinutes}
          dailyGoalMinutes={dailyGoalMinutes}
          streak={streak}
          streakFreezes={progressData?.streakFreezes ?? 0}
          lastActivityDate={progressData?.lastActivityDate}
          goalHistories={progressData?.goalHistories}
          isLoading={isStatsLoading}
        />
        <StreakMilestoneCard
          streak={streak}
          streakFreezes={progressData?.streakFreezes ?? 0}
          isLoading={isStatsLoading}
        />
      </div>

      {/* Tier 3: Asymmetric Bento Row (8 cols vs 4 cols) */}
      <div className="grid gap-6 md:grid-cols-12 items-stretch">
        <div className="md:col-span-8 flex flex-col">
          <WeeklyStudyChart
            heatmapData={heatmapData}
            dailyGoalMinutes={dailyGoalMinutes}
            todayStudyMinutes={todayStudyMinutes}
            goalHistories={progressData?.goalHistories}
            isLoading={isStatsLoading}
          />
        </div>

        <div className="md:col-span-4 flex flex-col">
          <MemoryRetentionCard
            levels={memoryLevels}
            totalLearnedWords={totalLearnedWords}
            dueCount={dueCount}
            isLoading={isStatsLoading}
          />
        </div>
      </div>

      {/* Tier 4: Wide Bento Card with Full Heatmap Grid (Full Width) */}
      <div className="w-full">
        <HeatmapCalendar
          todayStudyMinutes={todayStudyMinutes}
          streak={streak}
        />
      </div>
    </div>
  );
}
