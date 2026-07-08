import { ApiEndpointEnum } from '@/shared/constants';
import { HttpMethod, MapperRegistry, BYPASS_MAPPER } from '@lumen/shared-api';
import { registryKey } from '@lumen/shared-api';

export const registry: MapperRegistry = {
  [registryKey(HttpMethod.GET, ApiEndpointEnum.TOEIC_TESTS)]: BYPASS_MAPPER as any,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.TOEIC_TEST_DETAIL)]: BYPASS_MAPPER as any,
};
