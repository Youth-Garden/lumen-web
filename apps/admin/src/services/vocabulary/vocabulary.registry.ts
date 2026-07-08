import { BYPASS_MAPPER, HttpMethod, registryKey } from '@lumen/shared-api';
import type { MapperRegistry } from '@lumen/shared-api';
import { ApiEndpointEnum } from '@/shared/constants';

export const registry: MapperRegistry = {
  [registryKey(HttpMethod.GET, ApiEndpointEnum.VOCABULARY_WORDS)]: BYPASS_MAPPER as any,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.VOCABULARY_WORD_DETAIL)]: BYPASS_MAPPER as any,
  [registryKey(HttpMethod.POST, ApiEndpointEnum.VOCABULARY_WORDS)]: BYPASS_MAPPER as any,
  [registryKey(HttpMethod.PUT, ApiEndpointEnum.VOCABULARY_WORD_DETAIL)]: BYPASS_MAPPER as any,
  [registryKey(HttpMethod.DELETE, ApiEndpointEnum.VOCABULARY_WORD_DETAIL)]: BYPASS_MAPPER as any,
};
