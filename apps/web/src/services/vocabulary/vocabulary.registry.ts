import { ApiEndpointEnum } from '@/shared/constants';
import { HttpMethod, MapperRegistry, registryKey } from '@lumen/shared-api';
import { idResponseMapper } from '@/services/core';
import {
  folderFlashcardsPageMapper,
  folderListMapper,
  folderMapper,
  folderTopicListMapper,
  vocabularyOverviewMapper,
  wordMapper,
} from './vocabulary.mappers';

export const registry: MapperRegistry = {
  [registryKey(HttpMethod.GET, ApiEndpointEnum.VOCABULARY_WORDS)]: wordMapper,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.VOCABULARY_WORD_DETAIL)]:
    wordMapper,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.VOCABULARY_FOLDERS)]:
    folderListMapper,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.VOCABULARY_FOLDER_DETAIL)]:
    folderMapper,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.VOCABULARY_FOLDER_TOPICS)]:
    folderTopicListMapper,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.VOCABULARY_FOLDER_FLASHCARDS)]:
    folderFlashcardsPageMapper,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.VOCABULARY_OVERVIEW)]:
    vocabularyOverviewMapper,
  [registryKey(HttpMethod.POST, ApiEndpointEnum.VOCABULARY_FOLDERS)]:
    idResponseMapper,
  [registryKey(HttpMethod.POST, ApiEndpointEnum.VOCABULARY_FLASHCARDS)]:
    idResponseMapper,
};
