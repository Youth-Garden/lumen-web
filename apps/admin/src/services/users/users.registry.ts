import { HttpMethod, registryKey } from '@lumen/shared-api';
import type { MapperRegistry } from '@lumen/shared-api';
import { ApiEndpointEnum } from '@/shared/constants';
import { userMapper, userListMapper } from './users.mappers';

export const registry: MapperRegistry = {
  [registryKey(HttpMethod.GET, ApiEndpointEnum.USERS)]: userListMapper,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.USER_DETAIL)]: userMapper,
  [registryKey(HttpMethod.POST, ApiEndpointEnum.USERS)]: userMapper,
  [registryKey(HttpMethod.PUT, ApiEndpointEnum.USER_DETAIL)]: userMapper,
};
