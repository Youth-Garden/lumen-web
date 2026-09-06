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

    // Attach Bearer token to request headers
    this.axiosInstance.interceptors.request.use((reqConfig) => {
      const token = useAuthStore.getState().accessToken;
      if (token) {
        reqConfig.headers.Authorization = `Bearer ${token}`;
      }
      return reqConfig;
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
          const isOnLoginPage =
            typeof window !== 'undefined' &&
            (window.location.pathname.includes('/login') ||
              window.location.pathname.includes(RouteEnum.LOGIN));

          if (authStore.isAuthenticated && authStore.refreshToken) {
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

              if (isSuccess) {
                // Update auth store
                authStore.setAuth(
                  user || authStore.user,
                  newAccessToken || authStore.accessToken,
                  newRefreshToken || authStore.refreshToken,
                );

                CoreService.processQueue(null);
                return this.axiosInstance(originalRequest);
              } else {
                throw new Error('Refresh failed');
              }
            } catch (refreshError) {
              CoreService.processQueue(refreshError, null);

              if (!isOnLoginPage) {
                toast.error(
                  'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.',
                  { id: 'session-expired' },
                );
              }

              authStore.clearAuth();
              if (typeof window !== 'undefined' && !isOnLoginPage) {
                window.location.href = RouteEnum.LOGIN;
              }
              return Promise.reject(refreshError);
            } finally {
              CoreService.isRefreshing = false;
            }
          } else {
            // Not authenticated or no refresh token
            const hadAuth = Boolean(authStore.accessToken);
            authStore.clearAuth();

            // Only notify if user WAS logged in, is not already on login page, and not an auth endpoint
            if (
              hadAuth &&
              !isOnLoginPage &&
              !originalRequest.url?.includes(ApiEndpointEnum.LOGIN) &&
              !originalRequest.url?.includes(ApiEndpointEnum.GOOGLE_LOGIN) &&
              !originalRequest.url?.includes(ApiEndpointEnum.REFRESH_TOKEN) &&
              !originalRequest.url?.includes(ApiEndpointEnum.LOGOUT)
            ) {
              toast.error(
                'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.',
                { id: 'session-expired' },
              );
              if (typeof window !== 'undefined') {
                window.location.href = RouteEnum.LOGIN;
              }
            } else if (
              !hadAuth &&
              !isOnLoginPage &&
              !originalRequest.disabledToast &&
              error.response &&
              (originalRequest.url?.includes(ApiEndpointEnum.LOGIN) ||
                originalRequest.url?.includes(ApiEndpointEnum.GOOGLE_LOGIN))
            ) {
              // Show toast ONLY for explicit login failures, never for background queries
              const message =
                error.response.data?.message ||
                error.message ||
                'Unauthorized';
              const errorData = error.response.data;
              const errors = errorData?.error ?? errorData?.errors ?? [];
              toast.error(message, {
                id: 'auth-error',
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
