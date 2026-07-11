import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/services/auth';
import { RouteEnum, JWT_REFRESH_TOKEN_KEY } from '@/shared/constants';
import { cookieHelper } from '@lumen/utils';

export const useLogout = () => {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const router = useRouter();

  const logout = useCallback(
    async (redirectUrl: string = RouteEnum.LOGIN) => {
      const refreshToken = cookieHelper.get(JWT_REFRESH_TOKEN_KEY);

      // Optimistically clear local state immediately for snappy UI
      clearAuth();

      // Redirect immediately
      if (redirectUrl) {
        router.push(redirectUrl);
      }

      // Call API in background if refresh token exists
      if (refreshToken) {
        try {
          await authService.logout({ refreshToken });
        } catch (error) {
          // Ignore logout errors
        }
      }
    },
    [clearAuth, router]
  );

  return { logout };
};
