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

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const { mutate: updateProfile, isPending: isUpdatingProfile } = useUpdateProfile();
  const { mutate: updateProgressSettings, isPending: isUpdatingProgress } = useProgressSettings();

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
        toast.success('Profile updated successfully');
      },
      onError: () => {
        toast.error('Failed to update profile');
      },
    });
  });

  const onProgressSubmit = progressForm.handleSubmit((data) => {
    updateProgressSettings(
      { dailyGoalMinutes: Number(data.dailyGoalMinutes) },
      {
        onSuccess: () => {
          toast.success('Study goals updated successfully');
        },
        onError: () => {
          toast.error('Failed to update study goals');
        },
      }
    );
  });

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Icons name="settings" className="w-8 h-8 text-primary" />
          Settings
        </h2>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile" className="flex gap-2">
            <Icons name="user" className="w-4 h-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex gap-2">
            <Icons name="flag" className="w-4 h-4" /> Study Goals
          </TabsTrigger>
          <TabsTrigger value="account" className="flex gap-2">
            <Icons name="shield" className="w-4 h-4" /> Account
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and public profile.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onProfileSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" {...profileForm.register('fullName')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" {...profileForm.register('phone')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avatarUrl">Avatar URL</Label>
                  <Input id="avatarUrl" {...profileForm.register('avatarUrl')} />
                </div>
                <Button type="submit" disabled={isUpdatingProfile}>
                  {isUpdatingProfile ? 'Saving...' : 'Save changes'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Study Goals</CardTitle>
              <CardDescription>
                Set your daily learning target to maintain your streak.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onProgressSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dailyGoalMinutes">Daily Goal (Minutes)</Label>
                  <Input
                    id="dailyGoalMinutes"
                    type="number"
                    min="1"
                    {...progressForm.register('dailyGoalMinutes')}
                  />
                </div>
                <Button type="submit" disabled={isUpdatingProgress}>
                  {isUpdatingProgress ? 'Saving...' : 'Save goals'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your email, password, and security preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" disabled value={user?.email || ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" placeholder="Coming soon..." disabled />
              </div>
              <Button variant="destructive" disabled>Change Password (Coming soon)</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
