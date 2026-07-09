import { ApiEndpointEnum } from '@/shared/constants';
import { HttpMethod, MapperRegistry, registryKey } from '@lumen/shared-api';
import {
  materialListMapper,
  materialMapper,
  dictationResultMapper,
} from './material.mappers';

export const registry: MapperRegistry = {
  [registryKey(HttpMethod.GET, ApiEndpointEnum.MATERIALS)]: materialListMapper,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.MATERIAL_DETAIL)]:
    materialMapper,
  [registryKey(HttpMethod.POST, ApiEndpointEnum.MATERIAL_DICTATION)]:
    dictationResultMapper,
};
