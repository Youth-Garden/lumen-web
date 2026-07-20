import { ApiEndpointEnum } from '@/shared/constants';
import { HttpMethod, MapperRegistry, registryKey } from '@lumen/shared-api';
import { speakingTaskMapper, speechResultMapper } from './speaking.mappers';

export const registry: MapperRegistry = {
  [registryKey(HttpMethod.GET, ApiEndpointEnum.SPEAKING_TASKS)]:
    speakingTaskMapper,
  [registryKey(HttpMethod.POST, ApiEndpointEnum.SPEAKING_TASK_SUBMIT)]:
    speechResultMapper,
};
