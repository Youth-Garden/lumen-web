'use client';

import { Input, Label } from '@lumen/uikit/components';
import { useTranslations } from 'next-intl';

import { UserInfo } from '@/services/auth/auth.types';

interface SecurityCardProps {
  user: UserInfo | null;
}

export function SecurityCard({ user }: SecurityCardProps) {
  const t = useTranslations('Settings');

  return (
    <div className="rounded-xl border bg-card p-6 space-y-6">
      {/* Email Section */}
      <div>
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-base font-semibold text-foreground">
            {t('account.title')}
          </h3>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="security-email">{t('account.email')}</Label>
          <Input
            id="security-email"
            type="email"
            disabled
            value={user?.email ?? ''}
            className="bg-muted/50"
          />
          <p className="text-xs text-muted-foreground">
            {t('account.emailHint')}
          </p>
        </div>
      </div>
    </div>
  );
}
