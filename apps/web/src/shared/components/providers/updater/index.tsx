'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/services/auth';

function useAuthUpdater() {
  const { accessToken, clearAuth, setLoading } = useAuthStore();

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await authService.getMe();
        if (isMounted && res.data) {
          useAuthStore.setState({ user: res.data, isAuthenticated: true });
        }
      } catch (error) {
        if (isMounted) {
          clearAuth();
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [accessToken, clearAuth, setLoading]);
}

export function Updater() {
  useAuthUpdater();
  return null;
}
