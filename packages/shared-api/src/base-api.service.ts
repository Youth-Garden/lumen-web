import {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponseTransformer,
  create,
  isCancel,
} from 'axios';
import {
  ApiError,
  BaseResponse,
  HttpMethod,
  MapperRegistry,
  RequestConfig,
  registryKey,
} from './types';

export interface BaseApiServiceConfig {
  baseURL: string;
  mappers?: MapperRegistry;
  timeout?: number;
  getToken?: () => string | null | undefined;
  onError?: (errors: string[], message: string) => void;
  onNetworkError?: (message: string) => void;
}

function flattenApiErrors(errors: unknown): string[] {
  if (!errors) return [];
  if (typeof errors === 'string') return [errors];
  if (Array.isArray(errors)) return errors.map((error) => String(error));
  if (typeof errors !== 'object') return [String(errors)];

  return Object.entries(errors as Record<string, unknown>).flatMap(([field, value]) => {
    if (Array.isArray(value)) {
      return value.map((message) => `${field}: ${String(message)}`);
    }
    return [`${field}: ${String(value)}`];
  });
}

function formatUrl(url: string, pathParams?: Record<string, string | number>): string {
  if (!pathParams) return url;
  let formattedUrl = url;
  for (const [key, value] of Object.entries(pathParams)) {
    formattedUrl = formattedUrl.replace(`:${key}`, String(value));
  }
  return formattedUrl;
}

export abstract class BaseApiService {
  protected readonly axiosInstance: AxiosInstance;
  protected readonly mappers: MapperRegistry;
  private readonly config: BaseApiServiceConfig;

  constructor(config: BaseApiServiceConfig) {
    this.config = config;
    this.axiosInstance = create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
    });
    this.mappers = config.mappers || {};

    this.axiosInstance.interceptors.request.use((reqConfig) => {
      const token = this.config.getToken?.();
      if (token) {
        reqConfig.headers.Authorization = `Bearer ${token}`;
      }
      return reqConfig;
    });
  }

  private async request<T = any>(
    method: HttpMethod,
    url: string,
    config: RequestConfig = {},
    data?: any
  ): Promise<BaseResponse<T>> {
    try {
      const mapper =
        config.mapperKey !== undefined
          ? this.mappers[config.mapperKey]
          : (this.mappers[registryKey(method, url)] ?? this.mappers[url]);
      const formattedUrl = formatUrl(url, config.pathParams);

      const finalConfig: AxiosRequestConfig = {
        ...config,
        method,
        url: formattedUrl,
        data,
        validateStatus: () => true,
      };

      const defaultTransforms =
        (create().defaults.transformResponse as AxiosResponseTransformer[]) || [];
      const normalize = (raw: any) => ({
        ...raw,
        code: raw.success !== false && raw.statusCode !== 400 && raw.statusCode !== 500 && raw.statusCode !== 401 && raw.statusCode !== 403 && raw.statusCode !== 404 ? 'success' : 'error',
      });
      const mapSuccessResponse = (raw: any) => {
        if (!mapper || raw?.code !== 'success') return raw;
        return mapper(raw);
      };
      finalConfig.transformResponse = [...defaultTransforms, normalize, mapSuccessResponse];

      finalConfig.headers = {
        'Api-Language': 'en',
        ...finalConfig.headers,
      };
      const result = await this.axiosInstance.request<BaseResponse<T>>(finalConfig);

      if (result.data?.code === 'error' && !config.disabledToast) {
        const errors = flattenApiErrors(result.data.error ?? result.data.errors ?? result.data.message);
        const message = result.data.message || 'Unknown Error';
        console.error('API Error:', {
          method,
          url: formattedUrl,
          payload: data,
          message,
          errors,
          response: result.data,
        });
        
        if (this.config.onError) {
          this.config.onError(errors, message);
        }
      }

      if (result.data?.code === 'error') {
        throw new ApiError(
          result.data.message || 'Unknown Error',
          result.data,
          !config.disabledToast
        );
      }

      return result.data;
    } catch (error: any) {
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
    config?: RequestConfig
  ): Promise<BaseResponse<T>> {
    return this.request<T>(HttpMethod.GET, url, { ...config, params });
  }

  protected _post<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<BaseResponse<T>> {
    return this.request<T>(HttpMethod.POST, url, config, data);
  }

  protected _put<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<BaseResponse<T>> {
    return this.request<T>(HttpMethod.PUT, url, config, data);
  }

  protected _patch<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<BaseResponse<T>> {
    return this.request<T>(HttpMethod.PATCH, url, config, data);
  }

  protected _delete<T = any>(
    url: string,
    params?: any,
    config?: RequestConfig
  ): Promise<BaseResponse<T>> {
    return this.request<T>(HttpMethod.DELETE, url, { ...config, params });
  }
}
