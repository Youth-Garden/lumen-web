'use client';

import {
  Button,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@lumen/uikit/components';
import { SettingsCard } from './settings-card';
import { Icons } from '@lumen/uikit/icons';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useUpdateProfile } from '@/features/auth/hooks/use-update-profile';
import { UserInfo } from '@/services/auth/auth.types';

interface PersonalInfoCardProps {
  user: UserInfo | null;
}

interface InfoRowProps {
  label: string;
  value?: string | null;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{value || '—'}</p>
    </div>
  );
}

export function PersonalInfoCard({ user }: PersonalInfoCardProps) {
  const t = useTranslations('Settings');
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const form = useForm({
    defaultValues: {
      fullName: user?.fullName ?? '',
      phone: user?.phone ?? '',
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    updateProfile(data, {
      onSuccess: () => {
        toast.success(t('profileUpdateSuccess'));
        setIsEditing(false);
      },
      onError: () => {
        toast.error(t('profileUpdateFailed'));
      },
    });
  });

  return (
    <SettingsCard>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>{t('profile.personalInfo')}</CardTitle>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="gap-1.5"
          >
            <Icons name="edit" className="h-3.5 w-3.5" />
            {t('buttons.edit')}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {!isEditing ? (
          <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-5">
            <InfoRow label={t('profile.fullName')} value={user?.fullName} />
            <InfoRow label={t('account.email')} value={user?.email} />
            <InfoRow label={t('profile.phone')} value={user?.phone} />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="personal-fullName">{t('profile.fullName')}</Label>
                <Input id="personal-fullName" {...form.register('fullName')} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="personal-phone">{t('profile.phone')}</Label>
                <Input id="personal-phone" {...form.register('phone')} />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" size="sm" disabled={isPending}>
                {isPending ? t('buttons.saving') : t('buttons.saveChanges')}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                {t('buttons.cancel')}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </SettingsCard>
  );
}
