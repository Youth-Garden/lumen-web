'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  ThemeSwitcher,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { cn } from '@lumen/uikit/utils';
import { useAuthStore } from '@/store/auth.store';
import { useUpdateProfile } from '@/features/auth/hooks/use-update-profile';
import { useProgressSettings } from '@/features/dashboard/hooks/use-progress-settings';
import { useProgressDashboard } from '@/features/dashboard/hooks/use-progress-dashboard';
import { useTranslations } from 'next-intl';
import type { IconName } from '@lumen/uikit/icons';
import { LanguageSwitcher } from '../components/language-switcher';

type SectionKey = 'profile' | 'goals' | 'appearance' | 'account';

const SECTIONS: { key: SectionKey; icon: IconName }[] = [
  { key: 'profile', icon: 'user' },
  { key: 'goals', icon: 'flag' },
  { key: 'appearance', icon: 'languages' },
  { key: 'account', icon: 'shield' },
];

export const SettingsPage = () => {
  const t = useTranslations('Settings');
  const [section, setSection] = useState<SectionKey>('profile');
  const user = useAuthStore((state) => state.user);
  const { mutate: updateProfile, isPending: isUpdatingProfile } =
    useUpdateProfile();
  const { mutate: updateProgressSettings, isPending: isUpdatingProgress } =
    useProgressSettings();

  const { data: dashboardData } = useProgressDashboard();

  const profileForm = useForm({
    defaultValues: {
      fullName: '',
      phone: '',
      avatarUrl: '',
    },
  });

  const progressForm = useForm({
    defaultValues: {
      dailyGoalMinutes: 15,
    },
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        fullName: user.fullName || '',
        phone: user.phone || '',
        avatarUrl: user.avatarUrl || '',
      });
    }
  }, [user, profileForm]);

  useEffect(() => {
    if (dashboardData) {
      progressForm.reset({
        dailyGoalMinutes: dashboardData.dailyGoalMinutes || 15,
      });
    }
  }, [dashboardData, progressForm]);

  const onProfileSubmit = profileForm.handleSubmit((data) => {
    updateProfile(data, {
      onSuccess: () => {
        toast.success(t('profileUpdateSuccess'));
      },
      onError: () => {
        toast.error(t('profileUpdateFailed'));
      },
    });
  });

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
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
          <Icons name="settings" className="h-7 w-7 text-primary" />
          {t('title')}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{t('subtitle')}</p>
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        {/* Section nav */}
        <nav className="md:w-56 md:shrink-0">
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
                        ? 'bg-muted font-medium text-foreground'
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
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

        {/* Content panel */}
        <div className="min-w-0 flex-1 space-y-6">
          {section === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>{t('profile.title')}</CardTitle>
                <CardDescription>{t('profile.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={onProfileSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">{t('profile.fullName')}</Label>
                    <Input id="fullName" {...profileForm.register('fullName')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('profile.phone')}</Label>
                    <Input id="phone" {...profileForm.register('phone')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="avatarUrl">{t('profile.avatarUrl')}</Label>
                    <Input
                      id="avatarUrl"
                      {...profileForm.register('avatarUrl')}
                    />
                  </div>
                  <Button type="submit" disabled={isUpdatingProfile}>
                    {isUpdatingProfile
                      ? t('buttons.saving')
                      : t('buttons.saveChanges')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {section === 'goals' && (
            <Card>
              <CardHeader>
                <CardTitle>{t('goals.title')}</CardTitle>
                <CardDescription>{t('goals.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={onProgressSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="dailyGoalMinutes">
                      {t('goals.dailyGoalMinutes')}
                    </Label>
                    <Input
                      id="dailyGoalMinutes"
                      type="number"
                      min="1"
                      {...progressForm.register('dailyGoalMinutes')}
                    />
                  </div>
                  <Button type="submit" disabled={isUpdatingProgress}>
                    {isUpdatingProgress
                      ? t('buttons.saving')
                      : t('buttons.saveGoals')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {section === 'appearance' && (
            <Card>
              <CardHeader>
                <CardTitle>{t('appearance.title')}</CardTitle>
                <CardDescription>
                  {t('appearance.description')}
                </CardDescription>
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

          {section === 'account' && (
            <Card>
              <CardHeader>
                <CardTitle>{t('account.title')}</CardTitle>
                <CardDescription>{t('account.description')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('account.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    disabled
                    value={user?.email || ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current-password">
                    {t('account.currentPassword')}
                  </Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder={t('account.comingSoon')}
                    disabled
                  />
                </div>
                <Button variant="destructive" disabled>
                  {t('account.changePassword')}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
