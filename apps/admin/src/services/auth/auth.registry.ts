import { BYPASS_MAPPER, HttpMethod, registryKey } from '@lumen/shared-api';
import type { MapperRegistry } from '@lumen/shared-api';
import { ApiEndpointEnum } from '@/shared/constants';

export const registry: MapperRegistry = {
  [registryKey(HttpMethod.POST, ApiEndpointEnum.LOGIN)]: BYPASS_MAPPER as any,
  [registryKey(HttpMethod.POST, ApiEndpointEnum.LOGOUT)]: BYPASS_MAPPER as any,
  [registryKey(HttpMethod.POST, ApiEndpointEnum.REFRESH_TOKEN)]: BYPASS_MAPPER as any,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.GET_ME)]: BYPASS_MAPPER as any,
};
