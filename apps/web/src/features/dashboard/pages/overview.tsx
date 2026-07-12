'use client';

import { Icons } from '@lumen/uikit/icons';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Button,
} from '@lumen/uikit/components';
import { MetricCard } from '../components/metric-card';
import { RecentActivity } from '../components/recent-activity';
import { DailyGoalWidget } from '../components/daily-goal-widget';
import { XpProgressChart } from '../components/charts/xp-progress-chart';
import { useTranslations } from 'next-intl';
import { useProgressDashboard } from '../hooks/use-progress-dashboard';
import { useDueFlashcards } from '@/features/vocabulary/hooks/use-vocabulary';
import Link from 'next/link';
import { RouteEnum } from '@/shared/constants';

export function OverviewPage() {
  const t = useTranslations('Dashboard.Overview');
  const { data: progressData } = useProgressDashboard();
  const { data: dueFlashcards } = useDueFlashcards();
  const dueCount = dueFlashcards?.data?.length || 0;

  // Generate fake weekly data for the chart if backend doesn't provide it yet
  const chartData =
    progressData?.weeklyData ||
    Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return {
        date: d.toISOString(),
        xp: Math.floor(Math.random() * 200) + 50,
      };
    });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Your Learning Dashboard
        </h2>
        <div className="flex items-center space-x-2">
          <Button>Download Report</Button>
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">{t('tabs.overview')}</TabsTrigger>
          <TabsTrigger value="analytics">{t('tabs.analytics')}</TabsTrigger>
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
              title="Words Learned"
              value="342"
              trend="from last month"
              trendValue={12}
              icon="book-open"
            />
            <MetricCard
              title="Study Time"
              value="12h 30m"
              trend="this week"
              trendValue={5.2}
              icon="clock"
            />
          </div>

          {dueCount > 0 && (
            <Card className="border-orange-500/20 bg-orange-500/10 shadow-lg backdrop-blur-md hover:-translate-y-1 hover:shadow-orange-500/10 transition-all duration-300">
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
            <Card className="col-span-4 bg-background/40 backdrop-blur-md border-white/10 shadow-lg">
              <CardHeader>
                <CardTitle>XP Progress</CardTitle>
                <CardDescription>
                  Your learning activity over the last 7 days.
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <XpProgressChart data={chartData} />
              </CardContent>
            </Card>
            <div className="col-span-3">
              <DailyGoalWidget />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-1">
            <Card className="bg-background/40 backdrop-blur-md border-white/10 shadow-lg">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  You&apos;ve earned 450 XP this week.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentActivity />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
