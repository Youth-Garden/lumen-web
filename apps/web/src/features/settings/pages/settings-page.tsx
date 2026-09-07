'use client';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  ThemeSwitcher,
} from '@lumen/uikit/components';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useProgressDashboard } from '@/features/dashboard/hooks/use-progress-dashboard';
import { useProgressSettings } from '@/features/dashboard/hooks/use-progress-settings';
import { useAuthStore } from '@/store/auth.store';

import { LanguageSwitcher } from '@/shared/components/language-switcher';
import { ProfileCard } from '../components/profile-card';

export const SettingsPage = () => {
  const t = useTranslations('Settings');
  const user = useAuthStore((state) => state.user);
  const { mutate: updateProgressSettings, isPending: isUpdatingProgress } =
    useProgressSettings();

  const { data: dashboardData } = useProgressDashboard();

  const progressForm = useForm({
    defaultValues: {
      dailyGoalMinutes: 15,
    },
  });

  useEffect(() => {
    if (dashboardData) {
      progressForm.reset({
        dailyGoalMinutes: dashboardData.dailyGoalMinutes || 15,
      });
    }
  }, [dashboardData, progressForm]);

  const onProgressSubmit = progressForm.handleSubmit((data) => {
    updateProgressSettings(
      { dailyGoalMinutes: Number(data.dailyGoalMinutes) },
      {
        onSuccess: () => {
          toast.success(t('goalsUpdateSuccess'));
        },
        onError: () => {
          toast.error(t('goalsUpdateFailed'));
        },
      },
    );
  });

  return (
    <div className="max-w- mx-auto space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">
          {t('title')}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{t('subtitle')}</p>
      </div>

      <div className="space-y-6">
        {/* 1. Account Profile */}
        <ProfileCard user={user} />

        {/* 2. Appearance & Preferences */}
        <Card className="border border-border/60 rounded-2xl bg-card shadow-xs">
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              {t('appearance.title')}
            </CardTitle>
            <CardDescription>{t('appearance.description')}</CardDescription>
          </CardHeader>
          <CardContent className="divide-y divide-border/50">
            <div className="flex items-center justify-between gap-4 py-4 first:pt-0">
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-foreground">
                  {t('appearance.theme')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('appearance.themeDescription')}
                </p>
              </div>
              <ThemeSwitcher />
            </div>
            <div className="flex items-center justify-between gap-4 py-4 last:pb-0">
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-foreground">
                  {t('appearance.language')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('appearance.languageDescription')}
                </p>
              </div>
              <LanguageSwitcher />
            </div>
          </CardContent>
        </Card>

        {/* 3. Learning Goals */}
        <Card className="border border-border/60 rounded-2xl bg-card shadow-xs">
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              {t('goals.title')}
            </CardTitle>
            <CardDescription>{t('goals.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onProgressSubmit} className="flex items-end gap-4">
              <div className="space-y-1.5 flex-1 max-w-xs">
                <Label
                  htmlFor="dailyGoalMinutes"
                  className="text-xs font-semibold"
                >
                  {t('goals.dailyGoalMinutes')}
                </Label>
                <Input
                  id="dailyGoalMinutes"
                  type="number"
                  min="1"
                  className="border-border/60"
                  {...progressForm.register('dailyGoalMinutes')}
                />
              </div>
              <Button type="submit" size="sm" disabled={isUpdatingProgress}>
                {isUpdatingProgress
                  ? t('buttons.saving')
                  : t('buttons.saveGoals')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
