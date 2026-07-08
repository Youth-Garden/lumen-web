import { ApiEndpointEnum } from '@/shared/constants';
import { HttpMethod, MapperRegistry, BYPASS_MAPPER } from '@lumen/shared-api';
import { registryKey } from '@lumen/shared-api';
import { deckListMapper, wordListMapper, wordMapper } from './vocabulary.mappers';

export const registry: MapperRegistry = {
  [registryKey(HttpMethod.GET, ApiEndpointEnum.VOCABULARY_WORDS)]: wordListMapper,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.VOCABULARY_WORD_DETAIL)]: wordMapper,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.VOCABULARY_DECKS)]: deckListMapper,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.VOCABULARY_FLASHCARDS_DUE)]: BYPASS_MAPPER as any,
  [registryKey(HttpMethod.POST, ApiEndpointEnum.VOCABULARY_DECKS)]: BYPASS_MAPPER as any,
  [registryKey(HttpMethod.POST, ApiEndpointEnum.VOCABULARY_FLASHCARDS)]: BYPASS_MAPPER as any,
  [registryKey(HttpMethod.POST, ApiEndpointEnum.VOCABULARY_FLASHCARDS_REVIEW)]: BYPASS_MAPPER as any,
};
