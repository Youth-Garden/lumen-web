import { ApiEndpointEnum } from '@/shared/constants';
import { useAuthStore } from '@/store/auth.store';
import { BaseApiService, MapperRegistry } from '@lumen/shared-api';
import axios from 'axios';
import { toast } from 'sonner';

interface PendingRequest {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}

export abstract class CoreService extends BaseApiService {
  protected static isRefreshing = false;
  protected static failedQueue: PendingRequest[] = [];

  protected static processQueue(error: unknown, token: string | null = null) {
    CoreService.failedQueue.forEach((request) => {
      if (error) {
        request.reject(error);
      } else {
        request.resolve(token);
      }
    });
    CoreService.failedQueue = [];
  }

  constructor(mappers?: MapperRegistry) {
    super({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
      mappers,
      onError: (errors) => {
        const message = errors[0] || 'An error occurred';
        toast.error(message, { id: message });
      },
      onNetworkError: (message) => {
        toast.error(message, { id: 'network-error' });
      },
    });

    this.axiosInstance.interceptors.request.use((reqConfig) => {
      const token = useAuthStore.getState().accessToken;
      if (token) {
        reqConfig.headers.Authorization = `Bearer ${token}`;
      }
      return reqConfig;
    });

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (!originalRequest) {
          return Promise.reject(error);
        }

        const is401 =
          error.response?.status === 401 ||
          error.response?.data?.statusCode === 401;

        if (!is401 || originalRequest._retry) {
          return Promise.reject(error);
        }

        const requestUrl = originalRequest.url || '';
        const isAuthEndpoint =
          requestUrl.includes(ApiEndpointEnum.LOGIN) ||
          requestUrl.includes(ApiEndpointEnum.GOOGLE_LOGIN) ||
          requestUrl.includes(ApiEndpointEnum.REFRESH_TOKEN) ||
          requestUrl.includes(ApiEndpointEnum.LOGOUT);

        if (isAuthEndpoint) {
          return Promise.reject(error);
        }

        const authStore = useAuthStore.getState();

        if (authStore.isAuthenticated && authStore.refreshToken) {
          if (CoreService.isRefreshing) {
            return new Promise<string | null>((resolve, reject) => {
              CoreService.failedQueue.push({ resolve, reject });
            })
              .then((newToken) => {
                if (newToken) {
                  originalRequest.headers.Authorization = `Bearer ${newToken}`;
                }
                return this.axiosInstance(originalRequest);
              })
              .catch((queueError) => Promise.reject(queueError));
          }

          originalRequest._retry = true;
          CoreService.isRefreshing = true;

          try {
            const currentRefreshToken = authStore.refreshToken;
            const { data } = await axios.post(
              (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000') +
                ApiEndpointEnum.REFRESH_TOKEN,
              { refreshToken: currentRefreshToken },
              {
                headers: currentRefreshToken
                  ? { 'x-refresh-token': currentRefreshToken }
                  : {},
              },
            );

            const isSuccess = data?.statusCode === 201 || data?.data;
            const user = data?.data?.user;
            const newAccessToken = data?.data?.accessToken;
            const newRefreshToken = data?.data?.refreshToken;

            if (isSuccess && newAccessToken) {
              authStore.setAuth(
                user || authStore.user,
                newAccessToken,
                newRefreshToken || authStore.refreshToken,
              );

              CoreService.processQueue(null, newAccessToken);
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              return this.axiosInstance(originalRequest);
            }

            throw new Error('Refresh failed');
          } catch (refreshError) {
            CoreService.processQueue(refreshError, null);
            authStore.expireSession();
            return Promise.reject(refreshError);
          } finally {
            CoreService.isRefreshing = false;
          }
        }

        if (authStore.accessToken) {
          authStore.expireSession();
        } else {
          authStore.clearAuth();
        }

        return Promise.reject(error);
      },
    );
  }
}
