"use client";

import { Trophy, Flame, BookOpen, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger, Button } from '@lumen/uikit/components';
import { MetricCard } from '../components/metric-card';
import { RecentActivity } from '../components/recent-activity';
import { XpProgressChart } from '../components/charts/xp-progress-chart';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { progressService } from '../../../services/progress/progress.service';

export function OverviewPage() {
  const t = useTranslations('Dashboard.Overview');
  const { data: progressData } = useQuery({
    queryKey: ['dashboard-progress'],
    queryFn: () => progressService.getDashboardData(),
  });

  // Generate fake weekly data for the chart if backend doesn't provide it yet
  const chartData = progressData?.weeklyData || Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      date: d.toISOString(),
      xp: Math.floor(Math.random() * 200) + 50,
    };
  });

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Your Learning Dashboard</h2>
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
              icon={Trophy}
            />
            <MetricCard
              title="Current Streak"
              value={`${progressData?.streak || 0} days`}
              trend="keep it up!"
              trendValue={100}
              icon={Flame}
            />
            <MetricCard
              title="Words Learned"
              value="342"
              trend="from last month"
              trendValue={12}
              icon={BookOpen}
            />
            <MetricCard
              title="Study Time"
              value="12h 30m"
              trend="this week"
              trendValue={5.2}
              icon={Clock}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
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
            <Card className="col-span-3">
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
