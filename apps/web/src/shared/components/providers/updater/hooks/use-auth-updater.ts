'use client';

import { useEffect } from 'react';
import { useIsMounted } from '@lumen/hooks';
import { RouteEnum } from '@/shared/constants';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/services/auth';

export function useAuthUpdater() {
  const { isAuthenticated, clearAuth, setLoading } = useAuthStore();
  const isMounted = useIsMounted();

  useEffect(() => {
    const loadProfile = async () => {
      const isOnLoginPage =
        typeof window !== 'undefined' &&
        window.location.pathname.includes(RouteEnum.LOGIN);

      if (
        !isAuthenticated ||
        !useAuthStore.getState().accessToken ||
        isOnLoginPage
      ) {
        setLoading(false);
        return;
      }

      try {
        const res = await authService.getMe();
        if (isMounted() && res.data) {
          useAuthStore.setState({ user: res.data, isAuthenticated: true });
        }
      } catch {
        if (isMounted()) {
          clearAuth();
        }
      } finally {
        if (isMounted()) {
          setLoading(false);
        }
      }
    };

    loadProfile();
  }, [isAuthenticated]);
}
