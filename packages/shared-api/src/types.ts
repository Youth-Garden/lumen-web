import { AxiosRequestConfig } from 'axios';

export interface RequestConfig extends AxiosRequestConfig {
  disabledToast?: boolean;
  mapperKey?: string;
  pathParams?: Record<string, string | number>;
}

export interface BaseResponse<T> {
  code: string;
  message: string;
  data: T;
  error?: any;
  errors?: unknown;
}

export interface Paging<T> {
  items: T[];
  meta: {
    currentPage: number;
    perPage: number;
    totalItems: number;
  };
}

export type ResponseMapper = (data: any) => any;
export type MapperRegistry = Record<string, ResponseMapper>;

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

export function registryKey(method: HttpMethod, endpoint: string): string {
  return `${method}:${endpoint}`;
}

export const BYPASS_MAPPER = '__bypass__';

export class ApiError extends Error {
  public response: { data: any };
  public isHandled: boolean;

  constructor(message: string, data: any, isHandled: boolean = false) {
    super(message);
    this.name = 'ApiError';
    this.response = { data };
    this.isHandled = isHandled;
  }
}
