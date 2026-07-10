import { ApiEndpointEnum } from '@/shared/constants';
import { HttpMethod, MapperRegistry, registryKey } from '@lumen/shared-api';
import { toeicTestListMapper, toeicTestMapper } from './toeic.mappers';

export const registry: MapperRegistry = {
  [registryKey(HttpMethod.GET, ApiEndpointEnum.TOEIC_TESTS)]:
    toeicTestListMapper,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.TOEIC_TEST_DETAIL)]:
    toeicTestMapper,
};
