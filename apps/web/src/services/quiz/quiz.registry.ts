import { ApiEndpointEnum } from '@/shared/constants';
import { HttpMethod, MapperRegistry, registryKey } from '@lumen/shared-api';
import { idResponseMapper } from '@/services/core';
import {
  quizListItemMapper,
  quizDetailMapper,
  finishQuizResponseMapper,
} from './quiz.mappers';

export const registry: MapperRegistry = {
  [registryKey(HttpMethod.GET, ApiEndpointEnum.QUIZZES)]: quizListItemMapper,
  [registryKey(HttpMethod.POST, ApiEndpointEnum.QUIZZES)]: idResponseMapper,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.QUIZ_DETAIL)]: quizDetailMapper,
  [registryKey(HttpMethod.POST, ApiEndpointEnum.QUIZ_FINISH)]:
    finishQuizResponseMapper,
};
