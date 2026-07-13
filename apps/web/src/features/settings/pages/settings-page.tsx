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
import { Icons } from '@lumen/uikit/icons';
import type { IconName } from '@lumen/uikit/icons';
import { cn } from '@lumen/uikit/utils';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useProgressSettings } from '@/features/dashboard/hooks/use-progress-settings';
import { useProgressDashboard } from '@/features/dashboard/hooks/use-progress-dashboard';
import { useAuthStore } from '@/store/auth.store';

import { LanguageSwitcher } from '../components/language-switcher';
import { PersonalInfoCard } from '../components/personal-info-card';
import { ProfileCard } from '../components/profile-card';
import { SecurityCard } from '../components/security-card';

export enum SettingsSectionEnum {
  PROFILE = 'profile',
  GOALS = 'goals',
  APPEARANCE = 'appearance',
  SECURITY = 'security',
}

interface SectionItem {
  key: SettingsSectionEnum;
  icon: IconName;
}

const SECTIONS: SectionItem[] = [
  { key: SettingsSectionEnum.PROFILE, icon: 'user' },
  { key: SettingsSectionEnum.GOALS, icon: 'flag' },
  { key: SettingsSectionEnum.APPEARANCE, icon: 'languages' },
  { key: SettingsSectionEnum.SECURITY, icon: 'shield' },
];

export const SettingsPage = () => {
  const t = useTranslations('Settings');
  const [section, setSection] = useState<SettingsSectionEnum>(
    SettingsSectionEnum.PROFILE,
  );
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
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t('subtitle')}</p>
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        {/* Section Nav */}
        <nav className="md:w-52 md:shrink-0">
          <ul className="flex gap-1 overflow-x-auto md:sticky md:top-6 md:flex-col md:overflow-visible">
            {SECTIONS.map((item) => {
              const isActive = section === item.key;
              return (
                <li key={item.key} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setSection(item.key)}
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors outline-none focus-visible:ring-4 focus-visible:ring-primary/20',
                      isActive
                        ? 'bg-primary/10 font-medium text-primary'
                        : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                    )}
                  >
                    <Icons name={item.icon} className="h-4 w-4 shrink-0" />
                    {t(`sections.${item.key}`)}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Content Panel */}
        <div className="min-w-0 flex-1 space-y-4">
          {section === SettingsSectionEnum.PROFILE && (
            <>
              <ProfileCard user={user} />
              <PersonalInfoCard user={user} />
            </>
          )}

          {section === SettingsSectionEnum.GOALS && (
            <div className="rounded-xl border bg-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    {t('goals.title')}
                  </h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {t('goals.description')}
                  </p>
                </div>
              </div>
              <form onSubmit={onProgressSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="dailyGoalMinutes">
                    {t('goals.dailyGoalMinutes')}
                  </Label>
                  <Input
                    id="dailyGoalMinutes"
                    type="number"
                    min="1"
                    className="max-w-xs"
                    {...progressForm.register('dailyGoalMinutes')}
                  />
                </div>
                <Button type="submit" size="sm" disabled={isUpdatingProgress}>
                  {isUpdatingProgress
                    ? t('buttons.saving')
                    : t('buttons.saveGoals')}
                </Button>
              </form>
            </div>
          )}

          {section === SettingsSectionEnum.APPEARANCE && (
            <Card>
              <CardHeader>
                <CardTitle>{t('appearance.title')}</CardTitle>
                <CardDescription>{t('appearance.description')}</CardDescription>
              </CardHeader>
              <CardContent className="divide-y divide-border">
                <div className="flex items-center justify-between gap-4 py-4 first:pt-0">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">
                      {t('appearance.theme')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t('appearance.themeDescription')}
                    </p>
                  </div>
                  <ThemeSwitcher />
                </div>
                <div className="flex items-center justify-between gap-4 py-4 last:pb-0">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">
                      {t('appearance.language')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t('appearance.languageDescription')}
                    </p>
                  </div>
                  <LanguageSwitcher />
                </div>
              </CardContent>
            </Card>
          )}

          {section === SettingsSectionEnum.SECURITY && (
            <SecurityCard user={user} />
          )}
        </div>
      </div>
    </div>
  );
};
