import { ApiEndpointEnum } from '@/shared/constants';
import { HttpMethod, MapperRegistry, registryKey } from '@lumen/shared-api';
import { toeicTestListItemMapper, toeicTestMapper } from './toeic.mappers';

export const registry: MapperRegistry = {
  [registryKey(HttpMethod.GET, ApiEndpointEnum.TOEIC_TESTS)]:
    toeicTestListItemMapper,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.TOEIC_TEST_DETAIL)]:
    toeicTestMapper,
};
