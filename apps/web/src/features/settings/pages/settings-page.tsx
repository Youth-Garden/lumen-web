'use client';

import React, { useEffect } from 'react';
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { useAuthStore } from '@/store/auth.store';
import { useUpdateProfile } from '@/features/auth/hooks/use-update-profile';
import { useProgressSettings } from '@/features/dashboard/hooks/use-progress-settings';
import { useProgressDashboard } from '@/features/dashboard/hooks/use-progress-dashboard';
import { useTranslations } from 'next-intl';

export const SettingsPage = () => {
  const t = useTranslations('Settings');
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
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
          <Icons name="settings" className="h-8 w-8 text-primary" />
          {t('title')}
        </h2>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile" className="flex gap-2">
            <Icons name="user" className="h-4 w-4" /> {t('tabs.profile')}
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex gap-2">
            <Icons name="flag" className="h-4 w-4" /> {t('tabs.studyGoals')}
          </TabsTrigger>
          <TabsTrigger value="account" className="flex gap-2">
            <Icons name="shield" className="h-4 w-4" /> {t('tabs.account')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
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
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
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
        </TabsContent>

        <TabsContent value="account" className="space-y-4">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};
