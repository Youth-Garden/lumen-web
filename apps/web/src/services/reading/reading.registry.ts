import { ApiEndpointEnum } from '@/shared/constants';
import { HttpMethod, MapperRegistry, BYPASS_MAPPER } from '@lumen/shared-api';
import { registryKey } from '@lumen/shared-api';

export const registry: MapperRegistry = {
  [registryKey(HttpMethod.GET, ApiEndpointEnum.READING_ARTICLES)]: BYPASS_MAPPER as any,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.READING_ARTICLE_DETAIL)]: BYPASS_MAPPER as any,
  [registryKey(HttpMethod.POST, ApiEndpointEnum.READING_ARTICLES)]: BYPASS_MAPPER as any,
  [registryKey(HttpMethod.GET, ApiEndpointEnum.READING_TRANSLATE)]: BYPASS_MAPPER as any,
};
