import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth';
import { RouteEnum } from '@/shared/constants';
import { useAuthStore } from '@/store/auth.store';

export const useLogout = () => {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const queryClient = useQueryClient();

  const logout = useCallback(
    async (redirectUrl: string = RouteEnum.LOGIN) => {
      // 1. Call API first while session tokens are still available
      try {
        await authService.logout();
      } catch {
        // Ignore logout errors
      }

      // 2. Cancel active queries and wipe cache to prevent trailing 401s
      queryClient.cancelQueries();
      queryClient.clear();

      // 3. Clear local auth state & cookies
      clearAuth();

      // 4. Perform a hard browser redirect (window.location.href)
      // Soft SPA navigation (router.push) keeps stale Google Identity iframe/SDK state
      // in memory, causing error 401 malformed on immediate re-login unless hard reloaded.
      if (typeof window !== 'undefined' && redirectUrl) {
        window.location.href = redirectUrl;
      }
    },
    [clearAuth, queryClient],
  );

  return { logout };
};
