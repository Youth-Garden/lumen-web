import { DollarSign, Users, CreditCard, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger, Button } from '@lumen/uikit/components';
import { MetricCard } from '../components/metric-card';
import { RecentSales } from '../components/recent-sales';
import { useTranslations } from 'next-intl';

export function OverviewPage() {
  const t = useTranslations('Dashboard.Overview');
  return (
    <div className="flex-1 space-y-4 p-8 pt-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
        <div className="flex items-center space-x-2">
          <Button>{t('downloadReport')}</Button>
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">{t('tabs.overview')}</TabsTrigger>
          <TabsTrigger value="analytics">{t('tabs.analytics')}</TabsTrigger>
          <TabsTrigger value="reports">{t('tabs.reports')}</TabsTrigger>
          <TabsTrigger value="notifications">{t('tabs.notifications')}</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title={t('metrics.totalRevenue')}
              value="$45,231.89"
              trend={t('metrics.fromLastMonth')}
              trendValue={20.1}
              icon={DollarSign}
            />
            <MetricCard
              title={t('metrics.newUsers')}
              value="+2350"
              trend={t('metrics.fromLastMonth')}
              trendValue={180.1}
              icon={Users}
            />
            <MetricCard
              title={t('metrics.sales')}
              value="+12,234"
              trend={t('metrics.fromLastMonth')}
              trendValue={19}
              icon={CreditCard}
            />
            <MetricCard
              title={t('metrics.activeNow')}
              value="+573"
              trend={t('metrics.sinceLastHour')}
              trendValue={-2.4}
              icon={Activity}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>{t('revenueChart.title')}</CardTitle>
                <CardDescription>
                  {t('revenueChart.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2 flex justify-center items-center h-[350px]">
                {/* Fake Chart Area */}
                <div className="w-full h-full flex flex-col justify-end items-center px-4 pt-4 relative">
                  <div className="w-full h-full border-b border-l border-border/50 flex items-end justify-between px-2 pb-0">
                    {/* Fake bars */}
                    {[40, 70, 45, 90, 65, 80, 55, 100, 75, 85, 60, 95].map((h, i) => (
                      <div 
                        key={i} 
                        className="w-[6%] bg-primary/80 rounded-t-sm hover:bg-primary transition-colors cursor-pointer"
                        style={{ height: `${h}%` }}
                      ></div>
                    ))}
                  </div>
                  <div className="w-full flex justify-between mt-2 px-2 text-xs text-muted-foreground">
                    <span>T1</span><span>T2</span><span>T3</span><span>T4</span>
                    <span>T5</span><span>T6</span><span>T7</span><span>T8</span>
                    <span>T9</span><span>T10</span><span>T11</span><span>T12</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>{t('recentSales.title')}</CardTitle>
                <CardDescription>
                  {t('recentSales.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentSales />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
