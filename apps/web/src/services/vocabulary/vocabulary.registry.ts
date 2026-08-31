import { ApiEndpointEnum } from '@/shared/constants';
import { HttpMethod, MapperRegistry, registryKey } from '@lumen/shared-api';
import { idResponseMapper } from '@/services/core';
import {
  deckMapper,
  wordMapper,
  dueFlashcardMapper,
} from './vocabulary.mappers';

export const registry: MapperRegistry = {
  [registryKey(HttpMethod.GET, ApiEndpointEnum.VOCABULARY_WORDS)]: wordMapper,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.VOCABULARY_WORD_DETAIL)]:
    wordMapper,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.VOCABULARY_DECKS)]: deckMapper,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.VOCABULARY_DECK_DETAIL)]:
    (data: any) => data,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.VOCABULARY_FLASHCARDS_DUE)]:
    dueFlashcardMapper,
  [registryKey(HttpMethod.POST, ApiEndpointEnum.VOCABULARY_DECKS)]:
    idResponseMapper,
  [registryKey(HttpMethod.POST, ApiEndpointEnum.VOCABULARY_FLASHCARDS)]:
    idResponseMapper,
  [registryKey(HttpMethod.POST, ApiEndpointEnum.VOCABULARY_FLASHCARDS_REVIEW)]:
    idResponseMapper,
};
