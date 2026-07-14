import { ApiEndpointEnum } from '@/shared/constants';
import { BaseResponse } from '@lumen/shared-api';
import { CoreService } from '../core';
import { registry } from './exam-practice.registry';
import {
  AttemptHistoryResponse,
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

  pauseAttempt(
    attemptId: string,
    elapsedSeconds: number,
  ): Promise<BaseResponse<void>> {
    return this._post<void>(
      ApiEndpointEnum.EXAM_PRACTICE_ATTEMPT_PAUSE,
      { elapsedSeconds },
      {
        pathParams: { id: attemptId },
      },
    );
  }

  resumeAttempt(attemptId: string): Promise<BaseResponse<void>> {
    return this._post<void>(
      ApiEndpointEnum.EXAM_PRACTICE_ATTEMPT_RESUME,
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

  getMyAttempts(
    page: number,
    limit: number,
  ): Promise<BaseResponse<AttemptHistoryResponse>> {
    return this._get<AttemptHistoryResponse>(
      ApiEndpointEnum.EXAM_PRACTICE_MY_ATTEMPTS,
      { page, limit },
    );
  }

  startRetest(
    sourceAttemptId: string,
  ): Promise<BaseResponse<StartExamAttemptResponse>> {
    return this._post<StartExamAttemptResponse>(
      ApiEndpointEnum.EXAM_PRACTICE_RETEST,
      undefined,
      {
        pathParams: { id: sourceAttemptId },
      },
    );
  }
}

export const examPracticeService = ExamPracticeService.getInstance(registry);
