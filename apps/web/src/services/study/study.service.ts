import { CoreService } from '../core';
import { ApiEndpointEnum } from '@/shared/constants';
import { BaseResponse } from '@lumen/shared-api';
import { registry } from './study.registry';
import { DueFlashcard, ReviewFlashcardPayload } from './study.types';

export class StudyService extends CoreService {
  listDueFlashcards(params?: {
    folderId?: string;
    limit?: number;
  }): Promise<BaseResponse<DueFlashcard[]>> {
    return this._get<DueFlashcard[]>(ApiEndpointEnum.STUDY_FLASHCARDS_DUE, {
      params,
    });
  }

  reviewFlashcard(
    payload: ReviewFlashcardPayload,
  ): Promise<BaseResponse<void>> {
    return this._post<void>(ApiEndpointEnum.STUDY_FLASHCARDS_REVIEW, payload);
  }
}

export const studyService = StudyService.getInstance(registry);
