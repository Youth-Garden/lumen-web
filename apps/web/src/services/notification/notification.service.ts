import { CoreService } from '../core';
import { ApiEndpointEnum } from '@/shared/constants';
import { BaseResponse } from '@lumen/shared-api';
import { Notification, CreateNotificationPayload } from './notification.types';
import { registry } from './notification.registry';

export class NotificationService extends CoreService {
  getNotifications(params?: {
    page?: number;
    limit?: number;
  }): Promise<BaseResponse<Notification[]>> {
    return this._get<Notification[]>(ApiEndpointEnum.NOTIFICATIONS, params);
  }

  markAsRead(id: string): Promise<BaseResponse<void>> {
    return this._patch<void>(
      ApiEndpointEnum.NOTIFICATION_MARK_READ,
      undefined,
      { pathParams: { id } },
    );
  }

  markAllAsRead(): Promise<BaseResponse<void>> {
    return this._patch<void>(ApiEndpointEnum.NOTIFICATION_MARK_ALL_READ);
  }

  createDebugNotification(
    payload: CreateNotificationPayload,
  ): Promise<BaseResponse<void>> {
    return this._post<void>(ApiEndpointEnum.NOTIFICATION_DEBUG, payload);
  }
}

export const notificationService = NotificationService.getInstance(registry);
