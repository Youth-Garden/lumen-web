'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { useTranslations } from 'next-intl';
import { useToggle } from '@lumen/hooks';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useUpdateProfile } from '@/features/auth/hooks/use-update-profile';
import { UserInfo } from '@/services/auth';

interface ProfileCardProps {
  user: UserInfo | null;
}

export function ProfileCard({ user }: ProfileCardProps) {
  const t = useTranslations('Settings');
  const [isEditing, , setIsEditing] = useToggle(false);
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
    });
  });

  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((namePart) => namePart[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : (user?.email?.[0]?.toUpperCase() ?? '?');

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>{t('profile.title')}</CardTitle>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            <Icons name="edit" />
            {t('buttons.edit')}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 pt-2">
          <Avatar className="h-16 w-16">
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
            <p className="text-xs text-muted-foreground">
              {user?.role?.toUpperCase() === 'ADMIN'
                ? t('profile.roleAdmin')
                : t('profile.roleUser')}
            </p>
          </div>
        </div>

        {isEditing && (
          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-4 border-t pt-4"
          >
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
      </CardContent>
    </Card>
  );
}
