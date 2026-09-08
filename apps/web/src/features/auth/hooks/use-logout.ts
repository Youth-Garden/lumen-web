import { authService } from '@/services/auth';
import { RouteEnum } from '@/shared/constants';
import { useAuthStore } from '@/store/auth.store';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export const useLogout = () => {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const queryClient = useQueryClient();

  const logout = useCallback(
    async (redirectUrl: string = RouteEnum.LOGIN) => {
      await authService.logout();

      queryClient.cancelQueries();
      queryClient.clear();
      clearAuth();

      if (typeof window !== 'undefined' && redirectUrl) {
        window.location.href = redirectUrl;
      }
    },
    [clearAuth, queryClient],
  );

  return { logout };
};
