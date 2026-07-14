import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      accessToken: localStorage.getItem('access_token'),
      isAuthenticated: Boolean(localStorage.getItem('access_token')),
      setToken: (token) => {
        localStorage.setItem('access_token', token);
        set({ accessToken: token, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('access_token');
        set({ accessToken: null, isAuthenticated: false });
      },
    }),
    { name: 'AuthStore' },
  ),
);
