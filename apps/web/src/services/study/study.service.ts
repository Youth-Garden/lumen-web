import { CoreService } from '../core';
import { ApiEndpointEnum } from '@/shared/constants';
import { BaseResponse } from '@lumen/shared-api';
import { registry } from './study.registry';
import {
  BatchReviewFlashcardsPayload,
  DueFlashcard,
  FlashcardRating,
  ReviewFlashcardPayload,
} from './study.types';

export class StudyService extends CoreService {
  listDueFlashcards(params?: {
    folderId?: string;
    limit?: number;
  }): Promise<BaseResponse<DueFlashcard[]>> {
    return this._get<DueFlashcard[]>(
      ApiEndpointEnum.STUDY_FLASHCARDS_DUE,
      params,
    );
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

  batchReviewFlashcards(
    payload: BatchReviewFlashcardsPayload,
  ): Promise<BaseResponse<void>> {
    const reviews = payload.reviews.map((item) => {
      const isCorrect =
        item.isCorrect !== undefined
          ? item.isCorrect
          : item.quality !== FlashcardRating.WRONG;

      const isFastTrackKnown =
        item.isFastTrackKnown ??
        item.quality === FlashcardRating.FAST_TRACK_KNOWN;

      const isFastTrackTempMemory =
        item.isFastTrackTempMemory ??
        item.quality === FlashcardRating.FAST_TRACK_TEMP;

      const row: Record<string, unknown> = {
        flashcardId: item.flashcardId,
        isCorrect,
      };

      if (isFastTrackKnown) {
        row.isFastTrackKnown = true;
      }
      if (isFastTrackTempMemory) {
        row.isFastTrackTempMemory = true;
      }

      return row;
    });

    return this._post<void>(ApiEndpointEnum.STUDY_FLASHCARDS_REVIEW_BATCH, {
      reviews,
    });
  }
}

export const studyService = StudyService.getInstance(registry);
