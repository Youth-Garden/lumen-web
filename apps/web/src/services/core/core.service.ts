import { ApiEndpointEnum, RouteEnum } from '@/shared/constants';
import { useAuthStore } from '@/store/auth.store';
import { BaseApiService, MapperRegistry } from '@lumen/shared-api';
import axios from 'axios';
import { toast } from 'sonner';

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

          if (authStore.isAuthenticated) {
            if (CoreService.isRefreshing) {
              return new Promise(function (resolve, reject) {
                CoreService.failedQueue.push({ resolve, reject });
              })
                .then(() => {
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
                {}, // Send empty body, HttpOnly cookie 'jwtr' handles the token
                { withCredentials: true }, // Ensure cookies are sent with this plain axios instance
              );

              // Backend already set new cookies (HttpOnly) in response
              const isSuccess = data?.statusCode === 201 || data?.data;
              const user = data?.data?.user;

              if (isSuccess) {
                // Update auth store (without needing tokens)
                authStore.setAuth(user || authStore.user);

                CoreService.processQueue(null);
                return this.axiosInstance(originalRequest);
              } else {
                throw new Error('Refresh failed');
              }
            } catch (refreshError) {
              CoreService.processQueue(refreshError, null);
              toast.error(
                'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.',
              );
              authStore.clearAuth();
              import('@/services/auth')
                .then(({ authService }) => {
                  return authService.logout();
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
            // We should clear auth and redirect to login, unless this is a login/refresh/logout request itself
            if (
              !originalRequest.url?.includes(ApiEndpointEnum.LOGIN) &&
              !originalRequest.url?.includes(ApiEndpointEnum.GOOGLE_LOGIN) &&
              !originalRequest.url?.includes(ApiEndpointEnum.REFRESH_TOKEN) &&
              !originalRequest.url?.includes(ApiEndpointEnum.LOGOUT)
            ) {
              toast.error(
                'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.',
              );
              authStore.clearAuth();
              import('@/services/auth')
                .then(({ authService }) => {
                  return authService.logout();
                })
                .catch(() => {})
                .finally(() => {
                  if (window.location.pathname !== RouteEnum.LOGIN) {
                    window.location.href = RouteEnum.LOGIN;
                  }
                });
            } else {
              // Show toast for 401 errors when not authenticated (e.g. login failure)
              if (!originalRequest.disabledToast && error.response) {
                const message =
                  error.response.data?.message ||
                  error.message ||
                  'Unauthorized';
                const errorData = error.response.data;
                const errors = errorData?.error ?? errorData?.errors ?? [];
                toast.error(message, {
                  description:
                    Array.isArray(errors) && errors.length > 0
                      ? errors
                          .map((e: any) =>
                            typeof e === 'string'
                              ? e
                              : e.message || JSON.stringify(e),
                          )
                          .join('\n')
                      : undefined,
                });
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
                  ? errors
                      .map((e: any) =>
                        typeof e === 'string'
                          ? e
                          : e.message || JSON.stringify(e),
                      )
                      .join('\n')
                  : undefined,
            });
          }
        }
        return Promise.reject(error);
      },
    );
  }
}
