import {
  authKeys,
  authService,
  type UpdateProfilePayload,
} from '@/services/auth';
import { useAuthStore } from '@/store/auth.store';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const updateUserInStore = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      authService.updateProfile(payload),
    onSuccess: (res) => {
      if (res.data) {
        updateUserInStore(res.data);
      }
      queryClient.invalidateQueries({ queryKey: authKeys.me() });
    },
  });
};
