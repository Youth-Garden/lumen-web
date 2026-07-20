import { CoreService } from '../core';
import { ApiEndpointEnum } from '@/shared/constants';
import { BaseResponse, Paging } from '@lumen/shared-api';
import { registry } from './toeic.registry';
import {
  ToeicTestDto,
  ToeicTestListItemDto,
  SaveToeicNoteRequest,
} from './toeic.types';

export class ToeicService extends CoreService {
  getTests(): Promise<BaseResponse<Paging<ToeicTestListItemDto>>> {
    return this._get<Paging<ToeicTestListItemDto>>(ApiEndpointEnum.TOEIC_TESTS);
  }

  getTestById(id: string): Promise<BaseResponse<ToeicTestDto>> {
    return this._get<ToeicTestDto>(
      ApiEndpointEnum.TOEIC_TEST_DETAIL,
      undefined,
      {
        pathParams: { id },
      },
    );
  }

  getNotes(testId?: string): Promise<BaseResponse<any[]>> {
    return this._get<any[]>(
      ApiEndpointEnum.TOEIC_NOTES,
      testId ? { testId } : undefined,
    );
  }

  saveNote(noteData: SaveToeicNoteRequest): Promise<BaseResponse<void>> {
    return this._post<void>(ApiEndpointEnum.TOEIC_NOTES, noteData);
  }

  updateExplanation(
    questionId: string,
    explanationData: { explanation: string; mediaUrls?: string[] },
  ): Promise<BaseResponse<void>> {
    return this._put<void>(
      ApiEndpointEnum.TOEIC_QUESTION_EXPLANATION,
      explanationData,
      {
        pathParams: { id: questionId },
      },
    );
  }

  getMissingExplanations(): Promise<BaseResponse<any[]>> {
    return this._get<any[]>(ApiEndpointEnum.TOEIC_MISSING_EXPLANATIONS);
  }
}

export const toeicService = ToeicService.getInstance(registry);
