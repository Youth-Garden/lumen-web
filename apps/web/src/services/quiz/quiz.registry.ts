import { ApiEndpointEnum } from '@/shared/constants';
import { HttpMethod, MapperRegistry, BYPASS_MAPPER } from '@lumen/shared-api';
import { registryKey } from '@lumen/shared-api';

export const registry: MapperRegistry = {
  [registryKey(HttpMethod.GET, ApiEndpointEnum.QUIZZES)]: BYPASS_MAPPER as any,
  [registryKey(HttpMethod.POST, ApiEndpointEnum.QUIZZES)]: BYPASS_MAPPER as any,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.QUIZ_DETAIL)]: BYPASS_MAPPER as any,
  [registryKey(HttpMethod.POST, ApiEndpointEnum.QUIZ_ANSWER)]: BYPASS_MAPPER as any,
  [registryKey(HttpMethod.POST, ApiEndpointEnum.QUIZ_FINISH)]: BYPASS_MAPPER as any,
};
