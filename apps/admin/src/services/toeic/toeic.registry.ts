import { BYPASS_MAPPER, HttpMethod, registryKey } from '@lumen/shared-api';
import type { MapperRegistry } from '@lumen/shared-api';
import { ApiEndpointEnum } from '@/shared/constants';

export const registry: MapperRegistry = {
  [registryKey(HttpMethod.GET, ApiEndpointEnum.TOEIC_TESTS)]: BYPASS_MAPPER as any,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.TOEIC_TEST_DETAIL)]: BYPASS_MAPPER as any,
  [registryKey(HttpMethod.POST, ApiEndpointEnum.TOEIC_TESTS)]: BYPASS_MAPPER as any,
  [registryKey(HttpMethod.PUT, ApiEndpointEnum.TOEIC_TEST_DETAIL)]: BYPASS_MAPPER as any,
  [registryKey(HttpMethod.DELETE, ApiEndpointEnum.TOEIC_TEST_DETAIL)]: BYPASS_MAPPER as any,
  [registryKey(HttpMethod.POST, ApiEndpointEnum.TOEIC_TEST_PUBLISH)]: BYPASS_MAPPER as any,
};
