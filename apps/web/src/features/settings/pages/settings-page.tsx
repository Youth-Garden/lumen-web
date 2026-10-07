'use client';

import { DailyGoalDialog } from '@/features/dashboard/components/daily-goal-dialog';
import { useProgressDashboard } from '@/features/dashboard/hooks/use-progress-dashboard';
import { LanguageSwitcher } from '@/shared/components/language-switcher';
import { useAuthStore } from '@/store/auth.store';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ThemeSwitcher,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { usePortal } from '@lumen/uikit/portal';
import { useTranslations } from 'next-intl';

import { PageTitle } from '@/shared/components/page-title';

import { ProfileCard } from '../components/profile-card';
import { StreakFreezeCard } from '../components/streak-freeze-card';

export const SettingsPage = () => {
  const t = useTranslations('Settings');
  const user = useAuthStore((state) => state.user);
  const { data: dashboardData } = useProgressDashboard();
  const [presentDailyGoalDialog] = usePortal(DailyGoalDialog);

  const dailyGoalMinutes = dashboardData?.dailyGoalMinutes || 15;

  return (
    <div className="w-full max-w-[680px] mx-auto space-y-6 pb-10">
      <PageTitle title={t('title')} description={t('subtitle')} />

      <div className="space-y-6">
        {/* 1. Account Profile */}
        <ProfileCard user={user} />

        {/* 2. Appearance & Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              {t('appearance.title')}
            </CardTitle>
            <CardDescription>{t('appearance.description')}</CardDescription>
          </CardHeader>
          <CardContent className="divide-y divide-border/40">
            <div className="flex items-center justify-between gap-4 py-4 first:pt-0">
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-foreground">
                  {t('appearance.theme')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('appearance.themeDescription')}
                </p>
              </div>
              <ThemeSwitcher
                labels={{
                  light: t('appearance.themeLight'),
                  dark: t('appearance.themeDark'),
                  system: t('appearance.themeSystem'),
                }}
              />
            </div>
            <div className="flex items-center justify-between gap-4 py-4 last:pb-0">
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-foreground">
                  {t('appearance.nativeLanguage')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('appearance.nativeLanguageDescription')}
                </p>
              </div>
              <LanguageSwitcher />
            </div>
          </CardContent>
        </Card>

        {/* 3. Streak Freeze Protection */}
        <StreakFreezeCard dashboardData={dashboardData} />

        {/* 4. Learning Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              {t('goals.title')}
            </CardTitle>
            <CardDescription>{t('goals.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-4 py-1">
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-foreground">
                  {t('goals.dailyGoalMinutes')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('goals.dailyGoalDescription')}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => presentDailyGoalDialog()}
                className="gap-1.5 shrink-0 font-medium"
              >
                <span>{dailyGoalMinutes}m</span>
                <Icons
                  name="chevron-down"
                  className="h-3 w-3 opacity-60 ml-0.5"
                />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
