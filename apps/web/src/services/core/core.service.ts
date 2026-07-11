import { BaseApiService, MapperRegistry } from '@lumen/shared-api';
import { useAuthStore } from '@/store/auth.store';
import { toast } from 'sonner';

export abstract class CoreService extends BaseApiService {
  constructor(mappers?: MapperRegistry) {
    super({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
      mappers,
      getToken: () => useAuthStore.getState().accessToken,
      onError: (errors, message) => {
        // Automatically show toast for API errors
        toast.error(message, {
          description: errors.length > 0 ? errors.join('\n') : undefined,
        });
      },
      onNetworkError: (message) => {
        toast.error('Lỗi mạng', { description: message });
      },
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
            authStore.logout().then(() => {
              window.location.href = '/en/login';
            });
          }
        }
        return Promise.reject(error);
      },
    );
  }
}
