import { ApiEndpointEnum } from '@/shared/constants';
import { HttpMethod, MapperRegistry, registryKey } from '@lumen/shared-api';
import { idResponseMapper } from '@/services/core';
import {
  deckListMapper,
  wordListMapper,
  wordMapper,
  dueFlashcardsMapper,
} from './vocabulary.mappers';

export const registry: MapperRegistry = {
  [registryKey(HttpMethod.GET, ApiEndpointEnum.VOCABULARY_WORDS)]: wordListMapper,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.VOCABULARY_WORD_DETAIL)]: wordMapper,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.VOCABULARY_DECKS)]: deckListMapper,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.VOCABULARY_FLASHCARDS_DUE)]: dueFlashcardsMapper,
  [registryKey(HttpMethod.POST, ApiEndpointEnum.VOCABULARY_DECKS)]: idResponseMapper,
  [registryKey(HttpMethod.POST, ApiEndpointEnum.VOCABULARY_FLASHCARDS)]: idResponseMapper,
};
