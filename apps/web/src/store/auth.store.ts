import { JWT_ACCESS_TOKEN_KEY } from '@/shared/constants';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  role: string;
  fullName?: string;
  avatarUrl?: string;
  phone?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSessionExpired: boolean;

  setAuth: (user: User, accessToken?: string, refreshToken?: string) => void;
  updateUser: (user: Partial<User>) => void;
  setLoading: (isLoading: boolean) => void;
  clearAuth: () => void;
  expireSession: () => void;
  resetSessionExpired: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: true,
        isSessionExpired: false,

        setAuth: (user, accessToken, refreshToken) => {
          if (typeof document !== 'undefined') {
            document.cookie = `${JWT_ACCESS_TOKEN_KEY}=true; path=/; max-age=604800; SameSite=Lax`;
          }
          set((state) => ({
            user,
            accessToken: accessToken || state.accessToken,
            refreshToken: refreshToken || state.refreshToken,
            isAuthenticated: true,
            isSessionExpired: false,
          }));
        },

        updateUser: (userUpdates) =>
          set((state) => ({
            user: state.user ? { ...state.user, ...userUpdates } : null,
          })),

        setLoading: (isLoading) => set({ isLoading }),

        clearAuth: () => {
          if (typeof document !== 'undefined') {
            document.cookie = `${JWT_ACCESS_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
          }
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isSessionExpired: false,
          });
        },

        expireSession: () => {
          if (typeof document !== 'undefined') {
            document.cookie = `${JWT_ACCESS_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
          }
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isSessionExpired: true,
          });
        },

        resetSessionExpired: () => set({ isSessionExpired: false }),
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
          isAuthenticated: state.isAuthenticated,
        }),
      },
    ),
    { name: 'AuthStore' },
  ),
);
