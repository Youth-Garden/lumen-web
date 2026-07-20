import { CoreService } from '../core';
import { ApiEndpointEnum } from '@/shared/constants';
import { BaseResponse, Paging } from '@lumen/shared-api';
import { registry } from './vocabulary.registry';
import {
  CreateDeckPayload,
  CreateFlashcardPayload,
  Deck,
  DueFlashcard,
  ReviewFlashcardPayload,
  VocabularyWord,
} from './vocabulary.types';

export class VocabularyService extends CoreService {
  listWords(params?: {
    page?: number;
    limit?: number;
    deckId?: string;
    search?: string;
    cefrLevel?: string;
  }): Promise<BaseResponse<Paging<VocabularyWord>>> {
    return this._get<Paging<VocabularyWord>>(ApiEndpointEnum.VOCABULARY_WORDS, {
      params,
    });
  }

  getWord(id: string): Promise<BaseResponse<VocabularyWord>> {
    return this._get<VocabularyWord>(
      ApiEndpointEnum.VOCABULARY_WORD_DETAIL,
      undefined,
      {
        pathParams: { id },
      },
    );
  }

  listDecks(): Promise<BaseResponse<Deck[]>> {
    return this._get<Deck[]>(ApiEndpointEnum.VOCABULARY_DECKS);
  }

  createDeck(
    payload: CreateDeckPayload,
  ): Promise<BaseResponse<{ id: string }>> {
    return this._post<{ id: string }>(
      ApiEndpointEnum.VOCABULARY_DECKS,
      payload,
    );
  }

  createFlashcard(
    payload: CreateFlashcardPayload,
  ): Promise<BaseResponse<{ id: string }>> {
    return this._post<{ id: string }>(
      ApiEndpointEnum.VOCABULARY_FLASHCARDS,
      payload,
    );
  }

  listDueFlashcards(): Promise<BaseResponse<DueFlashcard[]>> {
    return this._get<DueFlashcard[]>(ApiEndpointEnum.VOCABULARY_FLASHCARDS_DUE);
  }

  reviewFlashcard(
    payload: ReviewFlashcardPayload,
  ): Promise<BaseResponse<void>> {
    return this._post<void>(
      ApiEndpointEnum.VOCABULARY_FLASHCARDS_REVIEW,
      payload,
    );
  }
}

export const vocabularyService = VocabularyService.getInstance(registry);
