import { WebApiService } from '../core/base-web-api.service';

export interface DashboardProgressResponse {
  streak: number;
  totalPoints: number;
  // We can add weekly XP data here later if the backend provides it
  weeklyData?: { date: string; xp: number }[];
}

export class ProgressService extends WebApiService {
  async getDashboardData(): Promise<DashboardProgressResponse> {
    const res = await this._get<DashboardProgressResponse>('/progress/dashboard');
    return res.data;
  }
}

export const progressService = new ProgressService();
