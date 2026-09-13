import { CoreService } from '../core';
import { ApiEndpointEnum } from '@/shared/constants';
import { BaseResponse, Paging } from '@lumen/shared-api';
import { registry } from './vocabulary.registry';
import {
  CreateFlashcardPayload,
  CreateFolderPayload,
  Folder,
  VocabularyOverview,
  VocabularyWord,
} from './vocabulary.types';

export class VocabularyService extends CoreService {
  listWords(params?: {
    page?: number;
    limit?: number;
    folderId?: string;
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

  listFolders(): Promise<BaseResponse<Folder[]>> {
    return this._get<Folder[]>(ApiEndpointEnum.VOCABULARY_FOLDERS);
  }

  getFolder(id: string): Promise<BaseResponse<Folder>> {
    return this._get<Folder>(
      ApiEndpointEnum.VOCABULARY_FOLDER_DETAIL,
      undefined,
      {
        pathParams: { id },
      },
    );
  }

  createFolder(
    payload: CreateFolderPayload,
  ): Promise<BaseResponse<{ id: string }>> {
    return this._post<{ id: string }>(
      ApiEndpointEnum.VOCABULARY_FOLDERS,
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

  getOverview(): Promise<BaseResponse<VocabularyOverview>> {
    return this._get<VocabularyOverview>(ApiEndpointEnum.VOCABULARY_OVERVIEW);
  }
}

export const vocabularyService = VocabularyService.getInstance(registry);
