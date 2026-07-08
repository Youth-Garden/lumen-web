import { ApiEndpointEnum } from '@/shared/constants';
import { HttpMethod, MapperRegistry, registryKey } from '@lumen/shared-api';
import { loginMapper, registerMapper } from './auth.mappers';

export const registry: MapperRegistry = {
  [registryKey(HttpMethod.POST, ApiEndpointEnum.LOGIN)]: loginMapper,
  [registryKey(HttpMethod.POST, ApiEndpointEnum.REGISTER)]: registerMapper,
};
