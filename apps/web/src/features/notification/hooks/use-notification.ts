import { notificationKeys, notificationService } from '@/services/notification';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useNotifications = () => {
  return useQuery({
    queryKey: notificationKeys.all,
    queryFn: () =>
      notificationService.getNotifications().then((res) => res.data),
    refetchInterval: 60000, // Refetch every minute
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
    onError: () => {
      toast.error('Failed to mark notification as read');
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
    onError: () => {
      toast.error('Failed to mark all as read');
    },
  });
};
