import { CoreService } from '../core';
import { ApiEndpointEnum } from '@/shared/constants';
import { registry } from './progress.registry';
import {
  DashboardProgressResponse,
  UpdateProgressSettingsPayload,
  ActivityItem,
} from './progress.types';

export class ProgressService extends CoreService {
  async getDashboardData(): Promise<DashboardProgressResponse> {
    const res = await this._get<DashboardProgressResponse>(ApiEndpointEnum.PROGRESS_DASHBOARD);
    return res.data;
  }

  async getRecentActivities(params?: { page?: number; limit?: number }): Promise<ActivityItem[]> {
    const res = await this._get<ActivityItem[]>(ApiEndpointEnum.PROGRESS_ACTIVITIES, { params });
    return res.data;
  }

  async updateSettings(
    payload: UpdateProgressSettingsPayload,
  ): Promise<void> {
    await this._put<void>(ApiEndpointEnum.PROGRESS_SETTINGS, payload);
  }
}

export const progressService = ProgressService.getInstance(registry);
