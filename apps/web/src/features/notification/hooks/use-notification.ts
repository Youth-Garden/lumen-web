import {
  notificationKeys,
  notificationService,
  type Notification,
} from '@/services/notification';
import { useAuthStore } from '@/store/auth.store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useNotifications = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: notificationKeys.all,
    queryFn: () =>
      notificationService.getNotifications().then((res) => res.data),
    enabled: isAuthenticated,
    refetchInterval: isAuthenticated ? 60000 : false,
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all });
      const previousNotifications = queryClient.getQueryData<Notification[]>(
        notificationKeys.all,
      );

      queryClient.setQueryData<Notification[]>(notificationKeys.all, (old) => {
        if (!Array.isArray(old)) return old;
        return old.map((item) =>
          item.id === id ? { ...item, isRead: true } : item,
        );
      });

      return { previousNotifications };
    },
    onError: (_err, _id, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          notificationKeys.all,
          context.previousNotifications,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all });
      const previousNotifications = queryClient.getQueryData<Notification[]>(
        notificationKeys.all,
      );

      queryClient.setQueryData<Notification[]>(notificationKeys.all, (old) => {
        if (!Array.isArray(old)) return old;
        return old.map((item) => ({ ...item, isRead: true }));
      });

      return { previousNotifications };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          notificationKeys.all,
          context.previousNotifications,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};
