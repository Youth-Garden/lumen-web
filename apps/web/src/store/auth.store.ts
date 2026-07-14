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
  isAuthenticated: boolean;
  isLoading: boolean;

  setAuth: (user: User) => void;
  updateUser: (user: Partial<User>) => void;
  setLoading: (isLoading: boolean) => void;
  clearAuth: () => void;
}

// Ensure cookie reads only happen on the client
// We still check if the cookie exists to set initial auth state, but we DO NOT set it manually anymore.
const getInitialAuth = () => {
  if (typeof document !== 'undefined') {
    return document.cookie.includes(`${JWT_ACCESS_TOKEN_KEY}=`);
  }
  return false;
};

const initialAuth = getInitialAuth();

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: initialAuth,
        isLoading: true,

        setAuth: (user) => {
          set({ user, isAuthenticated: true });
        },

        updateUser: (userUpdates) =>
          set((state) => ({
            user: state.user ? { ...state.user, ...userUpdates } : null,
          })),

        setLoading: (isLoading) => set({ isLoading }),

        clearAuth: () => {
          set({ user: null, isAuthenticated: false });
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      },
    ),
    { name: 'AuthStore' },
  ),
);
