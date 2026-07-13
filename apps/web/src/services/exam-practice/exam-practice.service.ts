import { ApiEndpointEnum } from '@/shared/constants';
import { BaseResponse } from '@lumen/shared-api';
import { CoreService } from '../core';
import { registry } from './exam-practice.registry';
import {
  ExamAttemptDetailResponse,
  StartExamAttemptRequest,
  StartExamAttemptResponse,
  SubmitExamAnswerRequest,
} from './exam-practice.types';

export class ExamPracticeService extends CoreService {
  startAttempt(
    data: StartExamAttemptRequest,
  ): Promise<BaseResponse<StartExamAttemptResponse>> {
    return this._post<StartExamAttemptResponse>(
      ApiEndpointEnum.EXAM_PRACTICE_ATTEMPTS,
      data,
    );
  }

  submitAnswer(
    attemptId: string,
    data: SubmitExamAnswerRequest,
  ): Promise<BaseResponse<void>> {
    return this._put<void>(
      ApiEndpointEnum.EXAM_PRACTICE_ATTEMPT_ANSWERS,
      data,
      {
        pathParams: { id: attemptId },
      },
    );
  }

  finishAttempt(attemptId: string): Promise<BaseResponse<void>> {
    return this._post<void>(
      ApiEndpointEnum.EXAM_PRACTICE_ATTEMPT_FINISH,
      undefined,
      {
        pathParams: { id: attemptId },
      },
    );
  }

  getAttempt(
    attemptId: string,
  ): Promise<BaseResponse<ExamAttemptDetailResponse>> {
    return this._get<ExamAttemptDetailResponse>(
      ApiEndpointEnum.EXAM_PRACTICE_ATTEMPT_DETAIL,
      undefined,
      {
        pathParams: { id: attemptId },
      },
    );
  }
}

export const examPracticeService = ExamPracticeService.getInstance(registry);
