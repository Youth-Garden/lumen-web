export interface Notification {
  id: string;
  userId: string;
  title: string;
  description: string;
  isRead: boolean;
  createdAt: string;
}

export interface CreateNotificationPayload {
  title: string;
  description: string;
}
