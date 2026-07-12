import { Notification } from './notification.types';

export const notificationMapper = (raw: unknown): Notification => {
  const item = raw as Notification;
  return {
    id: item.id,
    userId: item.userId,
    title: item.title,
    description: item.description,
    isRead: item.isRead,
    createdAt: item.createdAt,
  };
};

export const notificationListMapper = (raw: unknown): Notification[] => {
  if (!Array.isArray(raw)) return [];
  return raw.map(notificationMapper);
};
