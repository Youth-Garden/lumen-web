import { ApiEndpointEnum } from '@/shared/constants';
import { HttpMethod, MapperRegistry, registryKey } from '@lumen/shared-api';
import { idResponseMapper } from '@/services/core';
import { dueWordMapper } from './study.mappers';

export const registry: MapperRegistry = {
  [registryKey(HttpMethod.GET, ApiEndpointEnum.STUDY_WORDS_DUE)]: dueWordMapper,
  [registryKey(HttpMethod.POST, ApiEndpointEnum.STUDY_FLASHCARDS_REVIEW)]:
    idResponseMapper,
  [registryKey(HttpMethod.POST, ApiEndpointEnum.STUDY_FLASHCARDS_REVIEW_BATCH)]:
    idResponseMapper,
};
