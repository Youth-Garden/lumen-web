import { CoreService } from '../core';
import { ApiEndpointEnum } from '@/shared/constants';
import { registry } from './vocabulary.registry';
import type { BaseResponse } from '@lumen/shared-api';
import type { AdminVocabularyWord, CreateVocabularyWordPayload, UpdateVocabularyWordPayload, VocabularyWordListResponse } from './vocabulary.types';

export class VocabularyAdminService extends CoreService {
  listWords(params?: { page?: number; limit?: number; search?: string; cefrLevel?: string }): Promise<BaseResponse<VocabularyWordListResponse>> {
    return this._get<VocabularyWordListResponse>(ApiEndpointEnum.VOCABULARY_WORDS, { params });
  }

  getWordById(id: string): Promise<BaseResponse<AdminVocabularyWord>> {
    return this._get<AdminVocabularyWord>(ApiEndpointEnum.VOCABULARY_WORD_DETAIL, undefined, { pathParams: { id } });
  }

  createWord(payload: CreateVocabularyWordPayload): Promise<BaseResponse<AdminVocabularyWord>> {
    return this._post<AdminVocabularyWord>(ApiEndpointEnum.VOCABULARY_WORDS, payload);
  }

  updateWord(id: string, payload: UpdateVocabularyWordPayload): Promise<BaseResponse<AdminVocabularyWord>> {
    return this._put<AdminVocabularyWord>(ApiEndpointEnum.VOCABULARY_WORD_DETAIL, payload, { pathParams: { id } });
  }

  deleteWord(id: string): Promise<BaseResponse<void>> {
    return this._delete<void>(ApiEndpointEnum.VOCABULARY_WORD_DETAIL, { pathParams: { id } });
  }
}

export const vocabularyAdminService = VocabularyAdminService.getInstance(registry);
