import { idResponseMapper, voidResponseMapper } from '@/services/core';
import { ApiEndpointEnum } from '@/shared/constants';
import { HttpMethod, MapperRegistry, registryKey } from '@lumen/shared-api';
import {
  adaptiveDrillMapper,
  attemptHistoryMapper,
  examAttemptDetailMapper,
  weaknessAnalysisMapper,
} from './exam-practice.mappers';

export const registry: MapperRegistry = {
  [registryKey(HttpMethod.POST, ApiEndpointEnum.EXAM_PRACTICE_ATTEMPTS)]:
    idResponseMapper,
  [registryKey(HttpMethod.PUT, ApiEndpointEnum.EXAM_PRACTICE_ATTEMPT_ANSWERS)]:
    voidResponseMapper,
  [registryKey(HttpMethod.POST, ApiEndpointEnum.EXAM_PRACTICE_ATTEMPT_FINISH)]:
    voidResponseMapper,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.EXAM_PRACTICE_ATTEMPT_DETAIL)]:
    examAttemptDetailMapper,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.EXAM_PRACTICE_MY_ATTEMPTS)]:
    attemptHistoryMapper,
  [registryKey(HttpMethod.POST, ApiEndpointEnum.EXAM_PRACTICE_RETEST)]:
    idResponseMapper,
  [registryKey(HttpMethod.POST, ApiEndpointEnum.EXAM_PRACTICE_ATTEMPT_PAUSE)]:
    voidResponseMapper,
  [registryKey(HttpMethod.POST, ApiEndpointEnum.EXAM_PRACTICE_ATTEMPT_RESUME)]:
    voidResponseMapper,
  [registryKey(
    HttpMethod.GET,
    ApiEndpointEnum.EXAM_PRACTICE_WEAKNESS_ANALYSIS,
  )]: weaknessAnalysisMapper,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.EXAM_PRACTICE_ADAPTIVE_DRILL)]:
    adaptiveDrillMapper,
};
