'use client';

import { RouteEnum } from '@/shared/constants';
import { useAuthStore } from '@/store/auth.store';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

export function useSessionExpiredListener() {
  const router = useRouter();
  const t = useTranslations('Error');
  const isSessionExpired = useAuthStore((state) => state.isSessionExpired);
  const resetSessionExpired = useAuthStore(
    (state) => state.resetSessionExpired,
  );

  useEffect(() => {
    if (isSessionExpired) {
      resetSessionExpired();
      toast.error(t('sessionExpired'), { id: 'session-expired' });
      router.replace(RouteEnum.LOGIN);
    }
  }, [isSessionExpired, resetSessionExpired, router, t]);
}
