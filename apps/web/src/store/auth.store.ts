import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { cookieHelper } from '@lumen/utils';
import { JWT_ACCESS_TOKEN_KEY, JWT_REFRESH_TOKEN_KEY } from '@/shared/constants';

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
  isAuthenticated: boolean;
  isLoading: boolean;

  setAuth: (user: User, token: string, refreshToken?: string) => void;
  updateUser: (user: Partial<User>) => void;
  setLoading: (isLoading: boolean) => void;
  clearAuth: () => void;
}

// Ensure cookie reads only happen on the client
const getInitialToken = () => {
  return cookieHelper.get(JWT_ACCESS_TOKEN_KEY);
};

const initialToken = getInitialToken();

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
    (set, get) => ({
      user: null,
      accessToken: initialToken,
      isAuthenticated: !!initialToken,
      isLoading: true,

      setAuth: (user, token, refreshToken) => {
        cookieHelper.set(JWT_ACCESS_TOKEN_KEY, token, {
          expires: 7,
          secure: true,
        });
        if (refreshToken) {
          cookieHelper.set(JWT_REFRESH_TOKEN_KEY, refreshToken, {
            expires: 30,
            secure: true,
          });
        }
        set({ user, accessToken: token, isAuthenticated: true });
      },

      updateUser: (userUpdates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userUpdates } : null,
        })),

      setLoading: (isLoading) => set({ isLoading }),

      clearAuth: () => {
        cookieHelper.remove(JWT_ACCESS_TOKEN_KEY);
        cookieHelper.remove(JWT_REFRESH_TOKEN_KEY);
        set({ user: null, accessToken: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  ),
  { name: 'AuthStore' }
));
