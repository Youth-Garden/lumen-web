import { useMutation, useQuery } from '@tanstack/react-query';
import type { LoginPayload } from '@/services/auth';
import { authService, authKeys } from '@/services/auth';

export const useLogin = () => {
  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: () => authService.logout(),
  });
};

export const useMe = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: () => authService.getMe(),
    enabled: options?.enabled,
  });
};