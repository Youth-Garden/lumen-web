import { BaseApiService, MapperRegistry } from '@lumen/shared-api';
import { useAuthStore } from '@/store/auth.store';
import { toast } from 'sonner';
import {
  ApiEndpointEnum,
  RouteEnum,
  JWT_REFRESH_TOKEN_KEY,
} from '@/shared/constants';

import axios from 'axios';
import { cookieHelper } from '@lumen/utils';

export abstract class CoreService extends BaseApiService {
  protected static isRefreshing = false;
  protected static failedQueue: any[] = [];

  protected static processQueue(error: any, token: string | null = null) {
    CoreService.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    CoreService.failedQueue = [];
  }

  constructor(mappers?: MapperRegistry) {
    super({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
      mappers,
      getToken: () => useAuthStore.getState().accessToken,
      onError: (errors, message) => {
        // We will suppress toast on 401 if we handle it via refresh token
      },
      onNetworkError: (message) => {
        toast.error('Lỗi mạng', { description: message });
      },
    });

    // Handle 401 Unauthorized globally
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          (error.response?.status === 401 ||
            error.response?.data?.statusCode === 401) &&
          !originalRequest._retry
        ) {
          const authStore = useAuthStore.getState();
          const refreshToken = cookieHelper.get(JWT_REFRESH_TOKEN_KEY);

          if (authStore.isAuthenticated && refreshToken) {
            if (CoreService.isRefreshing) {
              return new Promise(function (resolve, reject) {
                CoreService.failedQueue.push({ resolve, reject });
              })
                .then((token) => {
                  originalRequest.headers.Authorization = 'Bearer ' + token;
                  return this.axiosInstance(originalRequest);
                })
                .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            CoreService.isRefreshing = true;

            try {
              // Plain axios call to avoid interceptor loops
              const { data } = await axios.post(
                (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000') +
                  ApiEndpointEnum.REFRESH_TOKEN,
                { refreshToken },
              );

              const newAccessToken = data?.data?.accessToken;
              const newRefreshToken = data?.data?.refreshToken;
              const user = data?.data?.user;

              if (newAccessToken) {
                // Update auth store & cookies
                authStore.setAuth(
                  user || authStore.user,
                  newAccessToken,
                  newRefreshToken || refreshToken,
                );

                CoreService.processQueue(null, newAccessToken);
                originalRequest.headers.Authorization =
                  'Bearer ' + newAccessToken;
                return this.axiosInstance(originalRequest);
              } else {
                throw new Error('No access token returned');
              }
            } catch (refreshError) {
              CoreService.processQueue(refreshError, null);
              toast.error(
                'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.',
              );
              authStore.clearAuth();
              import('@/services/auth')
                .then(({ authService }) => {
                  return authService.logout({ refreshToken });
                })
                .catch(() => {})
                .finally(() => {
                  window.location.href = RouteEnum.LOGIN;
                });
              return Promise.reject(refreshError);
            } finally {
              CoreService.isRefreshing = false;
            }
          } else {
            // Not authenticated or no refresh token
            if (authStore.isAuthenticated) {
              toast.error(
                'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.',
              );
              authStore.clearAuth();
              const refreshToken = cookieHelper.get(JWT_REFRESH_TOKEN_KEY);
              if (refreshToken) {
                import('@/services/auth')
                  .then(({ authService }) => {
                    return authService.logout({ refreshToken });
                  })
                  .catch(() => {})
                  .finally(() => {
                    window.location.href = RouteEnum.LOGIN;
                  });
              } else {
                window.location.href = RouteEnum.LOGIN;
              }
            }
          }
        } else {
          if (
            error.response &&
            !originalRequest.disabledToast &&
            error.response.status !== 401
          ) {
            const message =
              error.response.data?.message || error.message || 'Unknown Error';
            const errorData = error.response.data;
            const errors = errorData?.error ?? errorData?.errors ?? [];
            toast.error(message, {
              description:
                Array.isArray(errors) && errors.length > 0
                  ? errors.join('\n')
                  : undefined,
            });
          }
        }
        return Promise.reject(error);
      },
    );
  }
}
