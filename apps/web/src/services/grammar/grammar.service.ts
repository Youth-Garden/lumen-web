import { ApiEndpointEnum } from '@/shared/constants';
import { BaseResponse, Paging } from '@lumen/shared-api';
import { CoreService } from '../core';
import { registry } from './grammar.registry';
import type {
  GrammarExerciseDto,
  GrammarTopicDto,
  SubmitExerciseRequest,
  SubmitExerciseResultDto,
} from './grammar.types';

export class GrammarService extends CoreService {
  getTopics(params?: {
    page?: number;
    limit?: number;
    search?: string;
    cefrLevel?: string;
    category?: string;
  }): Promise<BaseResponse<Paging<GrammarTopicDto>>> {
    return this._get<Paging<GrammarTopicDto>>(ApiEndpointEnum.GRAMMAR_TOPICS, {
      params,
    });
  }

  getTopicById(id: string): Promise<BaseResponse<GrammarTopicDto>> {
    return this._get<GrammarTopicDto>(
      ApiEndpointEnum.GRAMMAR_TOPIC_DETAIL,
      undefined,
      {
        pathParams: { id },
      },
    );
  }

  getLessonExercises(
    lessonId: string,
  ): Promise<BaseResponse<GrammarExerciseDto[]>> {
    return this._get<GrammarExerciseDto[]>(
      ApiEndpointEnum.GRAMMAR_LESSON_EXERCISES,
      undefined,
      { pathParams: { id: lessonId } },
    );
  }

  submitExercise(
    exerciseId: string,
    data: SubmitExerciseRequest,
  ): Promise<BaseResponse<SubmitExerciseResultDto>> {
    return this._post<SubmitExerciseResultDto>(
      ApiEndpointEnum.GRAMMAR_EXERCISE_SUBMIT,
      data,
      { pathParams: { id: exerciseId } },
    );
  }
}

export const grammarService = GrammarService.getInstance(registry);
