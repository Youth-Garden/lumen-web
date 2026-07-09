import { HttpMethod, registryKey } from '@lumen/shared-api';
import type { MapperRegistry } from '@lumen/shared-api';
import { ApiEndpointEnum } from '@/shared/constants';
import { authResponseMapper, authUserMapper } from './auth.mappers';

export const registry: MapperRegistry = {
  [registryKey(HttpMethod.POST, ApiEndpointEnum.LOGIN)]: authResponseMapper,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.GET_ME)]: authUserMapper,
};
