import { HttpMethod, registryKey } from '@lumen/shared-api';
import type { MapperRegistry } from '@lumen/shared-api';
import { ApiEndpointEnum } from '@/shared/constants';
import { toeicTestMapper, toeicTestListMapper } from './toeic.mappers';

export const registry: MapperRegistry = {
  [registryKey(HttpMethod.GET, ApiEndpointEnum.TOEIC_TESTS)]:
    toeicTestListMapper,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.TOEIC_TEST_DETAIL)]:
    toeicTestMapper,
  [registryKey(HttpMethod.POST, ApiEndpointEnum.TOEIC_TESTS)]: toeicTestMapper,
  [registryKey(HttpMethod.PUT, ApiEndpointEnum.TOEIC_TEST_DETAIL)]:
    toeicTestMapper,
};
