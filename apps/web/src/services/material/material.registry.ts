import { ApiEndpointEnum } from '@/shared/constants';
import { HttpMethod, MapperRegistry, registryKey } from '@lumen/shared-api';
import { dictationResultMapper, materialMapper } from './material.mappers';

export const registry: MapperRegistry = {
  [registryKey(HttpMethod.GET, ApiEndpointEnum.MATERIALS)]: materialMapper,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.MATERIAL_DETAIL)]:
    materialMapper,
  [registryKey(HttpMethod.POST, ApiEndpointEnum.MATERIAL_DICTATION)]:
    dictationResultMapper,
};
