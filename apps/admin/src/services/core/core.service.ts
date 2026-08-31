import { BaseApiService } from '@lumen/shared-api';
import type { MapperRegistry } from '@lumen/shared-api';
import { useAuthStore } from '@/store/auth.store';
import { toast } from 'sonner';

export abstract class CoreService extends BaseApiService {
  constructor(mappers?: MapperRegistry) {
    super({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
      mappers,
      onError: (errors, message) => {
        toast.error(message, {
          description: errors.length > 0 ? errors.join('\n') : undefined,
        });
      },
      onNetworkError: (message) => {
        toast.error('Lỗi kết nối mạng', { description: message });
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
      (error) => {
        if (
          error.response?.status === 401 ||
          error.response?.data?.statusCode === 401
        ) {
          const authStore = useAuthStore.getState();
          if (authStore.isAuthenticated) {
            toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.');
            authStore.logout();
          }
        }
        return Promise.reject(error);
      },
    );
  }
}
