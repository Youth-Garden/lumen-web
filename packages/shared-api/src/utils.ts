import { HttpMethod } from './types';

export function registryKey(method: HttpMethod, endpoint: string): string {
  return `${method}:${endpoint}`;
}

export function formatUrl(
  url: string,
  params?: Record<string, string | number>,
): string {
  if (!params) return url;
  let formattedUrl = url;
  for (const [key, value] of Object.entries(params)) {
    formattedUrl = formattedUrl.replace(`:${key}`, String(value));
  }
  return formattedUrl;
}
