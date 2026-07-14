import { idResponseMapper } from '@/services/core';
import { ApiEndpointEnum } from '@/shared/constants';
import { HttpMethod, MapperRegistry, registryKey } from '@lumen/shared-api';
import {
  attemptHistoryMapper,
  examAttemptDetailMapper,
} from './exam-practice.mappers';

export const registry: MapperRegistry = {
  [registryKey(HttpMethod.POST, ApiEndpointEnum.EXAM_PRACTICE_ATTEMPTS)]:
    idResponseMapper,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.EXAM_PRACTICE_ATTEMPT_DETAIL)]:
    examAttemptDetailMapper,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.EXAM_PRACTICE_MY_ATTEMPTS)]:
    attemptHistoryMapper,
  [registryKey(HttpMethod.POST, ApiEndpointEnum.EXAM_PRACTICE_RETEST)]:
    idResponseMapper,
};
