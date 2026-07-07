import { AxiosRequestConfig } from 'axios';

export interface RequestConfig<T = any> extends AxiosRequestConfig {
  disabledToast?: boolean;
  mapperKey?: string;
  mapper?: ResponseMapper<T>;
  pathParams?: Record<string, string | number>;
  isFileUpload?: boolean;
}

export interface ErrorItem {
  field?: string;
  message: string;
}

export interface BaseResponse<T> {
  code: string;
  message: string;
  data: T;
  errors?: ErrorItem[];
}

export interface Paging<T> {
  items: T[];
  meta: {
    currentPage: number;
    perPage: number;
    totalItems: number;
  };
}

export type ResponseMapper<T = any> = (data: any) => T;
export type MapperRegistry = Record<string, ResponseMapper<any>>;

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
