import { ApiEndpointEnum } from '@/shared/constants';
import { HttpMethod, MapperRegistry, registryKey } from '@lumen/shared-api';
import { articleMapper, translateResponseMapper } from './reading.mappers';

export const registry: MapperRegistry = {
  [registryKey(HttpMethod.GET, ApiEndpointEnum.READING_ARTICLES)]:
    articleMapper,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.READING_ARTICLE_DETAIL)]:
    articleMapper,
  [registryKey(HttpMethod.POST, ApiEndpointEnum.READING_ARTICLES)]:
    articleMapper,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.READING_TRANSLATE)]:
    translateResponseMapper,
};
