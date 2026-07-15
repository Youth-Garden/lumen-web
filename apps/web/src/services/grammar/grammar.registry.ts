import { ApiEndpointEnum } from '@/shared/constants';
import { HttpMethod, MapperRegistry, registryKey } from '@lumen/shared-api';
import {
  grammarExerciseMapper,
  grammarTopicListMapper,
  grammarTopicMapper,
  submitExerciseResultMapper,
} from './grammar.mappers';

export const registry: MapperRegistry = {
  [registryKey(HttpMethod.GET, ApiEndpointEnum.GRAMMAR_TOPICS)]:
    grammarTopicListMapper,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.GRAMMAR_TOPIC_DETAIL)]:
    grammarTopicMapper,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.GRAMMAR_LESSON_EXERCISES)]: (
    raw,
  ) => (Array.isArray(raw) ? raw.map(grammarExerciseMapper) : []),
  [registryKey(HttpMethod.POST, ApiEndpointEnum.GRAMMAR_EXERCISE_SUBMIT)]:
    submitExerciseResultMapper,
};
