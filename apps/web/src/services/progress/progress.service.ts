import { ApiEndpointEnum } from '@/shared/constants';
import { CoreService } from '../core';
import { registry } from './progress.registry';
import {
  ActivityItem,
  DashboardProgressResponse,
  HeatmapItem,
  LeaderboardPeriodEnum,
  LeaderboardResponse,
  UpdateProgressSettingsPayload,
} from './progress.types';

export interface BadgeResponse {
  code: string;
  name: string;
  description: string;
  icon: string;
}

export class ProgressService extends CoreService {
  async getDashboardData(): Promise<DashboardProgressResponse> {
    const res = await this._get<DashboardProgressResponse>(
      ApiEndpointEnum.PROGRESS_DASHBOARD,
    );
    return res.data;
  }

  async getHeatmapData(year?: number): Promise<HeatmapItem[]> {
    const res = await this._get<HeatmapItem[]>(
      ApiEndpointEnum.PROGRESS_HEATMAP,
      year ? { year } : undefined,
    );
    return res.data;
  }

  async getRecentActivities(params?: {
    page?: number;
    limit?: number;
  }): Promise<ActivityItem[]> {
    const res = await this._get<ActivityItem[]>(
      ApiEndpointEnum.PROGRESS_ACTIVITIES,
      params,
    );
    return res.data;
  }

  async getLeaderboard(
    params?:
      | { period?: LeaderboardPeriodEnum; limit?: number; page?: number }
      | LeaderboardPeriodEnum,
  ): Promise<LeaderboardResponse> {
    const queryParams =
      typeof params === 'string' ? { period: params } : params;
    const res = await this._get<LeaderboardResponse>(
      ApiEndpointEnum.PROGRESS_LEADERBOARD,
      queryParams,
    );
    return res.data;
  }

  async updateSettings(payload: UpdateProgressSettingsPayload): Promise<void> {
    await this._put<void>(ApiEndpointEnum.PROGRESS_SETTINGS, payload);
  }

  async buyStreakFreeze(): Promise<void> {
    await this._post<void>(ApiEndpointEnum.PROGRESS_STREAK_FREEZE);
  }

  async getBadges(): Promise<BadgeResponse[]> {
    const res = await this._get<BadgeResponse[]>(
      ApiEndpointEnum.PROGRESS_BADGES,
    );
    return res.data;
  }
}

export const progressService = ProgressService.getInstance(registry);
