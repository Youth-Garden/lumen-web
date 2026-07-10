import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService, authKeys } from '@/services/auth';
import { UpdateProfilePayload } from '@/services/auth/auth.types';
import { useAuthStore } from '@/store/auth.store';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const updateUserInStore = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      authService.updateProfile(payload),
    onSuccess: (res) => {
      // Update auth store with new user info
      if (res.data) {
        updateUserInStore(res.data);
      }
      queryClient.invalidateQueries({ queryKey: authKeys.me() });
    },
  });
};
