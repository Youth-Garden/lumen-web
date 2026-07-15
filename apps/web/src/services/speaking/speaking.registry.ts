import { ApiEndpointEnum } from '@/shared/constants';
import { HttpMethod, MapperRegistry, registryKey } from '@lumen/shared-api';
import { speakingTaskListMapper, speechResultMapper } from './speaking.mappers';

export const registry: MapperRegistry = {
  [registryKey(HttpMethod.GET, ApiEndpointEnum.SPEAKING_TASKS)]:
    speakingTaskListMapper,
  [registryKey(HttpMethod.POST, ApiEndpointEnum.SPEAKING_TASK_SUBMIT)]:
    speechResultMapper,
};
