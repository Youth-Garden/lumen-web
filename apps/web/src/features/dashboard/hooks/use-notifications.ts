'use client';

import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { notificationService, notificationKeys } from '@/services/notification';

export const useNotifications = () => {
  return useQuery({
    queryKey: notificationKeys.list(),
    queryFn: () => notificationService.getNotifications(),
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
    },
  });
};
