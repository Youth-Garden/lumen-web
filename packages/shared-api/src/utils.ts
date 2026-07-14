import { HttpMethod } from './types';

export function registryKey(method: HttpMethod, endpoint: string): string {
  return `${method}:${endpoint}`;
}

export function formatUrl(
  url: string,
  pathParams?: Record<string, string | number>,
  queryParams?: Record<string, string | number | boolean | undefined | null>,
): string {
  let formattedUrl = url;

  if (pathParams) {
    for (const [key, value] of Object.entries(pathParams)) {
      formattedUrl = formattedUrl.replace(`:${key}`, String(value));
    }
  }

  if (queryParams) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    }
    const queryString = searchParams.toString();
    if (queryString) {
      formattedUrl += (formattedUrl.includes('?') ? '&' : '?') + queryString;
    }
  }

  return formattedUrl;
}
