import { ApiEndpointEnum } from '@/shared/constants';
import { HttpMethod, MapperRegistry, registryKey } from '@lumen/shared-api';
import { idResponseMapper } from '@/services/core';
import { dueFlashcardMapper } from './study.mappers';

export const registry: MapperRegistry = {
  [registryKey(HttpMethod.GET, ApiEndpointEnum.STUDY_FLASHCARDS_DUE)]:
    dueFlashcardMapper,
  [registryKey(HttpMethod.POST, ApiEndpointEnum.STUDY_FLASHCARDS_REVIEW)]:
    idResponseMapper,
};
