import { HttpMethod, registryKey } from '@lumen/shared-api';
import type { MapperRegistry } from '@lumen/shared-api';
import { ApiEndpointEnum } from '@/shared/constants';
import { materialMapper, materialListMapper } from './materials.mappers';

export const registry: MapperRegistry = {
  [registryKey(HttpMethod.GET, ApiEndpointEnum.MATERIALS)]: materialListMapper,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.MATERIAL_DETAIL)]:
    materialMapper,
  [registryKey(HttpMethod.POST, ApiEndpointEnum.MATERIALS)]: materialMapper,
  [registryKey(HttpMethod.PUT, ApiEndpointEnum.MATERIAL_DETAIL)]:
    materialMapper,
};
