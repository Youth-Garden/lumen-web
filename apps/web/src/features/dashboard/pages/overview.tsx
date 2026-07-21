'use client';

import { useDueFlashcards } from '@/features/vocabulary/hooks/use-vocabulary';
import { RouteEnum } from '@/shared/constants';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { BadgeGrid } from '../components/badge-grid';
import { XpProgressChart } from '../components/charts/xp-progress-chart';
import { DailyGoalWidget } from '../components/daily-goal-widget';
import { HeatmapCalendar } from '../components/heatmap-calendar';
import { LeaderboardWidget } from '../components/leaderboard-widget';
import { MetricCard } from '../components/metric-card';
import { RecentActivity } from '../components/recent-activity';
import { StreakCard } from '../components/streak-card';
import { useHeatmap, useProgressDashboard } from '../hooks';

export function OverviewPage() {
  const t = useTranslations('Dashboard.Overview');
  const { data: progressData } = useProgressDashboard();
  const { data: heatmapData, isLoading: heatmapLoading } = useHeatmap();
  const { data: dueFlashcards } = useDueFlashcards();
  const dueCount = dueFlashcards?.data?.length || 0;

  const chartData = Array.from({ length: 7 }).map((_, indexItem) => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - (6 - indexItem));
    return {
      date: currentDate.toISOString(),
      xp: Math.floor(Math.random() * 200) + 50,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Your Learning Dashboard
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Track daily streaks, leaderboards, and personalized progress.
          </p>
        </div>
      </div>

      <StreakCard
        streak={progressData?.streak || 0}
        streakFreezes={progressData?.streakFreezes || 0}
        totalPoints={progressData?.totalPoints || 0}
      />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">{t('tabs.overview')}</TabsTrigger>
          <TabsTrigger value="gamification">
            {t('tabs.gamification')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total XP"
              value={progressData?.totalPoints?.toString() || '0'}
              trend="from last week"
              trendValue={15.5}
              icon="trophy"
            />
            <MetricCard
              title="Current Streak"
              value={`${progressData?.streak || 0} days`}
              trend="keep it up!"
              trendValue={100}
              icon="flame"
            />
            <MetricCard
              title="Streak Freezes"
              value={`${progressData?.streakFreezes || 0}`}
              trend="shields available"
              trendValue={0}
              icon="shield"
            />
            <MetricCard
              title="Study Time"
              value={`${progressData?.todayStudyMinutes || 0}m`}
              trend="today"
              trendValue={0}
              icon="clock"
            />
          </div>

          {dueCount > 0 && (
            <Card className="hover:-translate-y-1 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icons name="flame" className="h-5 w-5 text-orange-500" />
                    <CardTitle className="text-orange-700 dark:text-orange-400">
                      Review Due Today
                    </CardTitle>
                  </div>
                </div>
                <CardDescription className="text-orange-600/80 dark:text-orange-400/80">
                  You have {dueCount} flashcard{dueCount !== 1 && 's'} pending
                  for review based on spaced repetition.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`${RouteEnum.VOCABULARY}/study`}>
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white border-0">
                    Review Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>XP Progress</CardTitle>
                <CardDescription>
                  Your learning activity over the last 7 days.
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2 flex-1 flex flex-col">
                <XpProgressChart data={chartData} />
              </CardContent>
            </Card>
            <div className="col-span-3 flex flex-col gap-4">
              <DailyGoalWidget />
              <HeatmapCalendar data={heatmapData} isLoading={heatmapLoading} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest learning achievements and milestones.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentActivity />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="gamification" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
            <div className="col-span-1 lg:col-span-3">
              <LeaderboardWidget />
            </div>
            <div className="col-span-1 lg:col-span-4">
              <BadgeGrid unlockedBadges={progressData?.unlockedBadges} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
