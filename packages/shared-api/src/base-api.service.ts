import {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponseTransformer,
  create,
  isCancel,
} from 'axios';
import qs from 'qs';
import {
  ApiError,
  BaseResponse,
  HttpMethod,
  MapperRegistry,
  RequestConfig,
} from './types';
import { registryKey } from './utils';

export interface BaseApiServiceConfig {
  baseURL: string;
  mappers?: MapperRegistry;
  timeout?: number;
  onError?: (errors: string[], message: string) => void;
  onNetworkError?: (message: string) => void;
}

function flattenApiErrors(errors: unknown): string[] {
  if (!errors) return [];
  if (typeof errors === 'string') return [errors];

  if (Array.isArray(errors)) {
    return errors.map((error) => {
      if (typeof error === 'string') return error;
      if (typeof error === 'object' && error !== null) {
        if ('message' in error) return String(error.message);
        return JSON.stringify(error);
      }
      return String(error);
    });
  }

  if (typeof errors !== 'object') return [String(errors)];

  return Object.entries(errors as Record<string, unknown>).flatMap(
    ([field, value]) => {
      if (Array.isArray(value)) {
        return value.map((message) => {
          if (typeof message === 'object' && message !== null) {
            return `${field}: ${message.message || JSON.stringify(message)}`;
          }
          return `${field}: ${String(message)}`;
        });
      }
      if (typeof value === 'object' && value !== null) {
        return [`${field}: ${JSON.stringify(value)}`];
      }
      return [`${field}: ${String(value)}`];
    },
  );
}

function formatUrl(
  url: string,
  pathParams?: Record<string, string | number>,
): string {
  if (!pathParams) return url;
  let formattedUrl = url;
  for (const [key, value] of Object.entries(pathParams)) {
    formattedUrl = formattedUrl.replace(`:${key}`, String(value));
  }
  return formattedUrl;
}

export abstract class BaseApiService {
  protected static _instance: any = null;

  public static getInstance<T extends BaseApiService>(
    this: new (...args: any[]) => T,
    ...args: any[]
  ): T {
    if (!(this as any)._instance) {
      (this as any)._instance = new this(...args);
    }
    return (this as any)._instance;
  }

  protected readonly axiosInstance: AxiosInstance;
  protected readonly mappers: MapperRegistry;
  private readonly config: BaseApiServiceConfig;

  constructor(config: BaseApiServiceConfig) {
    this.config = config;
    this.axiosInstance = create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      withCredentials: true, // Send HttpOnly cookies automatically
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: 'brackets' }),
    });
    this.mappers = config.mappers || {};

    this.axiosInstance.interceptors.request.use((reqConfig) => {
      return reqConfig;
    });
  }

  private async request<T = any>(
    method: HttpMethod,
    url: string,
    config: RequestConfig = {},
    data?: any,
  ): Promise<BaseResponse<T>> {
    try {
      // 1. Resolve mapper (direct mapper > registry mapper)
      const mapper =
        config.mapper ||
        (config.mapperKey !== undefined
          ? this.mappers[config.mapperKey]
          : (this.mappers[registryKey(method, url)] ?? this.mappers[url]));
      const formattedUrl = formatUrl(url, config.pathParams);

      const finalConfig: AxiosRequestConfig = {
        ...config,
        method,
        url: formattedUrl,
        data,
      };

      // 2. Add interceptors / transformers for mapping API structures
      const defaultTransforms =
        (create().defaults.transformResponse as AxiosResponseTransformer[]) ||
        [];

      const mapSuccessResponse = (raw: any) => {
        if (!mapper) return raw;

        // If data is array (like in pagination items), map each item
        if (raw && raw.data && Array.isArray(raw.data.items)) {
          return {
            ...raw,
            data: {
              ...raw.data,
              items: raw.data.items.map((item: any) => mapper(item)),
            },
          };
        }

        if (raw && Array.isArray(raw.data)) {
          return { ...raw, data: raw.data.map((item: any) => mapper(item)) };
        }

        if (raw && raw.data) {
          return { ...raw, data: mapper(raw.data) };
        }

        return mapper(raw);
      };

      finalConfig.transformResponse = [
        ...defaultTransforms,
        mapSuccessResponse,
      ];

      finalConfig.headers = {
        'Api-Language': 'en',
        ...finalConfig.headers,
      };
      const result =
        await this.axiosInstance.request<BaseResponse<T>>(finalConfig);

      return result.data;
    } catch (error: any) {
      if (error.response && !config.disabledToast) {
        const errorData = error.response.data;
        const errors = flattenApiErrors(
          errorData?.error ??
            errorData?.errors ??
            errorData?.message ??
            error.message,
        );
        const message = errorData?.message || error.message || 'Unknown Error';

        console.error('API Error:', {
          method,
          url,
          payload: data,
          message,
          errors,
          response: errorData,
        });

        if (this.config.onError) {
          this.config.onError(errors, message);
        }

        throw new ApiError(message, errorData, !config.disabledToast);
      }
      if (!isCancel(error) && !error.isHandled && !config.disabledToast) {
        console.error('Network Error:', error?.message);
        if (this.config.onNetworkError) {
          this.config.onNetworkError(error.message || 'Network Error');
        }
      }
      throw error;
    }
  }

  protected _get<T = any>(
    url: string,
    params?: any,
    config?: RequestConfig,
  ): Promise<BaseResponse<T>> {
    return this.request<T>(HttpMethod.GET, url, { ...config, params });
  }

  protected _post<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<BaseResponse<T>> {
    return this.request<T>(HttpMethod.POST, url, config, data);
  }

  protected _put<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<BaseResponse<T>> {
    return this.request<T>(HttpMethod.PUT, url, config, data);
  }

  protected _patch<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<BaseResponse<T>> {
    return this.request<T>(HttpMethod.PATCH, url, config, data);
  }

  protected _delete<T = any>(
    url: string,
    params?: any,
    config?: RequestConfig<T>,
  ): Promise<BaseResponse<T>> {
    return this.request<T>(HttpMethod.DELETE, url, { ...config, params });
  }

  // --- Helpers for Form Upload ---
  protected _postForm<T = any>(
    url: string,
    data: any,
    config?: RequestConfig<T>,
  ): Promise<BaseResponse<T>> {
    return this.request<T>(
      HttpMethod.POST,
      url,
      {
        ...config,
        headers: { ...config?.headers, 'Content-Type': 'multipart/form-data' },
      },
      this.toFormData(data),
    );
  }

  protected _putForm<T = any>(
    url: string,
    data: any,
    config?: RequestConfig<T>,
  ): Promise<BaseResponse<T>> {
    return this.request<T>(
      HttpMethod.PUT,
      url,
      {
        ...config,
        headers: { ...config?.headers, 'Content-Type': 'multipart/form-data' },
      },
      this.toFormData(data),
    );
  }

  private toFormData(obj: any): FormData {
    const formData = new FormData();
    Object.entries(obj).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof File || value instanceof Blob) {
          formData.append(key, value);
        } else if (Array.isArray(value)) {
          value.forEach((v) => formData.append(`${key}[]`, String(v)));
        } else {
          formData.append(key, String(value));
        }
      }
    });
    return formData;
  }
}
