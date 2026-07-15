import { ApiEndpointEnum } from '@/shared/constants';
import { HttpMethod, MapperRegistry, registryKey } from '@lumen/shared-api';
import {
  recentActivitiesMapper,
  heatmapListMapper,
  dashboardMapper,
} from './progress.mappers';

export const registry: MapperRegistry = {
  [registryKey(HttpMethod.GET, ApiEndpointEnum.PROGRESS_DASHBOARD)]:
    dashboardMapper,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.PROGRESS_HEATMAP)]:
    heatmapListMapper,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.PROGRESS_ACTIVITIES)]:
    recentActivitiesMapper,
};
