import { idResponseMapper, voidResponseMapper } from '@/services/core';
import { ApiEndpointEnum } from '@/shared/constants';
import { HttpMethod, MapperRegistry, registryKey } from '@lumen/shared-api';
import {
  dashboardMapper,
  heatmapListMapper,
  leaderboardMapper,
  recentActivitiesMapper,
} from './progress.mappers';

export const registry: MapperRegistry = {
  [registryKey(HttpMethod.GET, ApiEndpointEnum.PROGRESS_DASHBOARD)]:
    dashboardMapper,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.PROGRESS_HEATMAP)]:
    heatmapListMapper,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.PROGRESS_ACTIVITIES)]:
    recentActivitiesMapper,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.PROGRESS_LEADERBOARD)]:
    leaderboardMapper,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.PROGRESS_BADGES)]:
    voidResponseMapper,
  [registryKey(HttpMethod.PUT, ApiEndpointEnum.PROGRESS_SETTINGS)]:
    voidResponseMapper,
  [registryKey(HttpMethod.POST, ApiEndpointEnum.PROGRESS_STREAK_FREEZE)]:
    idResponseMapper,
};
