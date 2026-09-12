import { CoreService } from '../core';
import { ApiEndpointEnum } from '@/shared/constants';
import { BaseResponse } from '@lumen/shared-api';
import { registry } from './study.registry';
import {
  DueFlashcard,
  FlashcardRating,
  ReviewFlashcardPayload,
} from './study.types';

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
    const isCorrect =
      payload.isCorrect !== undefined
        ? payload.isCorrect
        : payload.quality !== FlashcardRating.WRONG;

    const isFastTrackKnown =
      payload.isFastTrackKnown ??
      payload.quality === FlashcardRating.FAST_TRACK_KNOWN;

    const isFastTrackTempMemory =
      payload.isFastTrackTempMemory ??
      payload.quality === FlashcardRating.FAST_TRACK_TEMP;

    const body: Record<string, unknown> = {
      flashcardId: payload.flashcardId,
      isCorrect,
    };

    if (isFastTrackKnown) {
      body.isFastTrackKnown = true;
    }
    if (isFastTrackTempMemory) {
      body.isFastTrackTempMemory = true;
    }

    return this._post<void>(ApiEndpointEnum.STUDY_FLASHCARDS_REVIEW, body);
  }
}

export const studyService = StudyService.getInstance(registry);
