import { WebApiService } from '../core/base-web-api.service';
import { ApiEndpointEnum } from '@/shared/constants';

export interface DashboardProgressResponse {
  streak: number;
  totalPoints: number;
  dailyGoalMinutes: number;
  weeklyData?: { date: string; xp: number }[];
}

export interface UpdateProgressSettingsPayload {
  dailyGoalMinutes?: number;
}

export class ProgressService extends WebApiService {
  async getDashboardData(): Promise<DashboardProgressResponse> {
    const res = await this._get<DashboardProgressResponse>(ApiEndpointEnum.PROGRESS_DASHBOARD);
    return res.data;
  }

  async updateSettings(payload: UpdateProgressSettingsPayload): Promise<void> {
    await this._put(ApiEndpointEnum.PROGRESS_SETTINGS, payload);
  }
}

export const progressService = new ProgressService();
