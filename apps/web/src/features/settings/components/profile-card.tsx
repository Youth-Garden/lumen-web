'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Input,
  Label,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useUpdateProfile } from '@/features/auth/hooks/use-update-profile';
import { UserInfo } from '@/services/auth/auth.types';

interface ProfileCardProps {
  user: UserInfo | null;
}

export function ProfileCard({ user }: ProfileCardProps) {
  const t = useTranslations('Settings');
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const form = useForm({
    defaultValues: {
      fullName: user?.fullName ?? '',
      avatarUrl: user?.avatarUrl ?? '',
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

  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : (user?.email?.[0]?.toUpperCase() ?? '?');

  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="flex items-start justify-between">
        <h3 className="text-base font-semibold text-foreground">
          {t('profile.title')}
        </h3>
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
      </div>

      <div className="mt-4 flex items-center gap-4">
        <Avatar className="h-16 w-16 border border-border shadow-sm">
          <AvatarImage
            src={user?.avatarUrl}
            seed={user?.email}
            alt={user?.fullName ?? 'Avatar'}
          />
          <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-lg font-semibold text-foreground">
            {user?.fullName ?? '—'}
          </p>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          <p className="text-xs text-muted-foreground capitalize">
            {user?.role?.toLowerCase()}
          </p>
        </div>
      </div>

      {isEditing && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 border-t pt-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="fullName">{t('profile.fullName')}</Label>
              <Input id="fullName" {...form.register('fullName')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="avatarUrl">{t('profile.avatarUrl')}</Label>
              <Input
                id="avatarUrl"
                placeholder="https://..."
                {...form.register('avatarUrl')}
              />
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
    </div>
  );
}
