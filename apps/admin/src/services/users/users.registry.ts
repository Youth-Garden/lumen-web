import { BYPASS_MAPPER, HttpMethod, registryKey } from '@lumen/shared-api';
import type { MapperRegistry } from '@lumen/shared-api';
import { ApiEndpointEnum } from '@/shared/constants';

export const registry: MapperRegistry = {
  [registryKey(HttpMethod.GET, ApiEndpointEnum.USERS)]: BYPASS_MAPPER as any,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.USER_DETAIL)]: BYPASS_MAPPER as any,
  [registryKey(HttpMethod.POST, ApiEndpointEnum.USERS)]: BYPASS_MAPPER as any,
  [registryKey(HttpMethod.PUT, ApiEndpointEnum.USER_DETAIL)]: BYPASS_MAPPER as any,
  [registryKey(HttpMethod.DELETE, ApiEndpointEnum.USER_DETAIL)]: BYPASS_MAPPER as any,
  [registryKey(HttpMethod.POST, ApiEndpointEnum.USER_BAN)]: BYPASS_MAPPER as any,
  [registryKey(HttpMethod.POST, ApiEndpointEnum.USER_UNBAN)]: BYPASS_MAPPER as any,
};
