import { CoreService } from '../core';
import { ApiEndpointEnum } from '@/shared/constants';
import { BaseResponse } from '@lumen/shared-api';
import { registry } from './quiz.registry';
import {
  GenerateQuizDto,
  SubmitAnswerDto,
  GenerateQuizResponseDto,
  FinishQuizResponseDto,
  QuizDetailResponseDto,
  QuizListResponseDto,
} from './quiz.types';

export class QuizService extends CoreService {
  generateQuiz(
    dto: GenerateQuizDto,
  ): Promise<BaseResponse<GenerateQuizResponseDto>> {
    return this._post<GenerateQuizResponseDto>(ApiEndpointEnum.QUIZ_GENERATE, dto);
  }

  getQuiz(id: string): Promise<BaseResponse<QuizDetailResponseDto>> {
    return this._get<QuizDetailResponseDto>(
      ApiEndpointEnum.QUIZ_DETAIL,
      undefined,
      {
        pathParams: { id },
      },
    );
  }

  submitAnswer(
    id: string,
    questionId: string,
    dto: SubmitAnswerDto,
  ): Promise<BaseResponse<void>> {
    return this._post<void>(ApiEndpointEnum.QUIZ_ANSWER, dto, {
      pathParams: { id, questionId },
    });
  }

  finishQuiz(id: string): Promise<BaseResponse<FinishQuizResponseDto>> {
    return this._post<FinishQuizResponseDto>(
      ApiEndpointEnum.QUIZ_FINISH,
      undefined,
      {
        pathParams: { id },
      },
    );
  }

  listQuizzes(params?: {
    page?: number;
    limit?: number;
  }): Promise<BaseResponse<QuizListResponseDto>> {
    return this._get<QuizListResponseDto>(ApiEndpointEnum.QUIZZES, { params });
  }
}

export const quizService = QuizService.getInstance(registry);
