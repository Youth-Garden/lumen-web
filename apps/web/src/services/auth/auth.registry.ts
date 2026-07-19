import { ApiEndpointEnum } from '@/shared/constants';
import { HttpMethod, MapperRegistry, registryKey } from '@lumen/shared-api';
import { loginMapper, getMeMapper } from './auth.mappers';

export const registry: MapperRegistry = {
  [registryKey(HttpMethod.POST, ApiEndpointEnum.LOGIN)]: loginMapper,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.GET_ME)]: getMeMapper,
};
