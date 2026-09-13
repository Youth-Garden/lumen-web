'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@lumen/uikit/components';
import { useTranslations } from 'next-intl';

import { UserInfo } from '@/services/auth';

interface SecurityCardProps {
  user: UserInfo | null;
}

export function SecurityCard({ user }: SecurityCardProps) {
  const t = useTranslations('Settings');

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>{t('account.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1.5 pt-2">
          <Label htmlFor="security-email">{t('account.email')}</Label>
          <Input
            id="security-email"
            type="email"
            disabled
            value={user?.email ?? ''}
          />
          <p className="text-xs text-muted-foreground">
            {t('account.emailHint')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
