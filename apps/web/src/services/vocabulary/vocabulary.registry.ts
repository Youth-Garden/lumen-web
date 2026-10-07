import { idResponseMapper } from '@/services/core';
import { ApiEndpointEnum } from '@/shared/constants';
import { HttpMethod, MapperRegistry, registryKey } from '@lumen/shared-api';
import {
  folderMapper,
  folderTopicMapper,
  vocabularyOverviewMapper,
  wordMapper,
} from './vocabulary.mappers';

export const registry: MapperRegistry = {
  [registryKey(HttpMethod.GET, ApiEndpointEnum.VOCABULARY_WORDS)]: wordMapper,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.VOCABULARY_WORD_DETAIL)]:
    wordMapper,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.VOCABULARY_FOLDERS)]:
    folderMapper,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.VOCABULARY_FOLDER_DETAIL)]:
    folderMapper,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.VOCABULARY_FOLDER_TOPICS)]:
    folderTopicMapper,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.VOCABULARY_TOPICS)]:
    folderTopicMapper,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.VOCABULARY_FOLDER_WORDS)]:
    wordMapper,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.VOCABULARY_FOLDER_FLASHCARDS)]:
    wordMapper,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.VOCABULARY_OVERVIEW)]:
    vocabularyOverviewMapper,
  [registryKey(HttpMethod.POST, ApiEndpointEnum.VOCABULARY_FOLDERS)]:
    idResponseMapper,
  [registryKey(HttpMethod.POST, ApiEndpointEnum.VOCABULARY_FLASHCARDS)]:
    idResponseMapper,
};
