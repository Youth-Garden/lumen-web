import { BYPASS_MAPPER, HttpMethod, registryKey } from '@lumen/shared-api';
import type { MapperRegistry } from '@lumen/shared-api';
import { ApiEndpointEnum } from '@/shared/constants';

export const registry: MapperRegistry = {
  [registryKey(HttpMethod.GET, ApiEndpointEnum.MATERIALS)]: BYPASS_MAPPER as any,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.MATERIAL_DETAIL)]: BYPASS_MAPPER as any,
  [registryKey(HttpMethod.POST, ApiEndpointEnum.MATERIALS)]: BYPASS_MAPPER as any,
  [registryKey(HttpMethod.PUT, ApiEndpointEnum.MATERIAL_DETAIL)]: BYPASS_MAPPER as any,
  [registryKey(HttpMethod.DELETE, ApiEndpointEnum.MATERIAL_DETAIL)]: BYPASS_MAPPER as any,
  [registryKey(HttpMethod.POST, ApiEndpointEnum.MATERIAL_PUBLISH)]: BYPASS_MAPPER as any,
};
