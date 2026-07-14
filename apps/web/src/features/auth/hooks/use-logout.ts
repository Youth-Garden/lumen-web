import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/services/auth';
import { RouteEnum } from '@/shared/constants';

export const useLogout = () => {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const router = useRouter();

  const logout = useCallback(
    async (redirectUrl: string = RouteEnum.LOGIN) => {
      // Optimistically clear local state immediately for snappy UI
      clearAuth();

      // Redirect immediately
      if (redirectUrl) {
        router.push(redirectUrl);
      }

      // Call API in background
      try {
        await authService.logout();
      } catch (error) {
        // Ignore logout errors
      }
    },
    [clearAuth, router]
  );

  return { logout };
};
