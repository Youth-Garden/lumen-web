import { HttpMethod, registryKey } from '@lumen/shared-api';
import type { MapperRegistry } from '@lumen/shared-api';
import { ApiEndpointEnum } from '@/shared/constants';
import { vocabWordMapper, vocabWordListMapper } from './vocabulary.mappers';

export const registry: MapperRegistry = {
  [registryKey(HttpMethod.GET, ApiEndpointEnum.VOCABULARY_WORDS)]:
    vocabWordListMapper,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.VOCABULARY_WORD_DETAIL)]:
    vocabWordMapper,
  [registryKey(HttpMethod.POST, ApiEndpointEnum.VOCABULARY_WORDS)]:
    vocabWordMapper,
  [registryKey(HttpMethod.PUT, ApiEndpointEnum.VOCABULARY_WORD_DETAIL)]:
    vocabWordMapper,
};
