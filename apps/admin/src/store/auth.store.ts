import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(devtools((set) => ({
  accessToken: localStorage.getItem('admin_jwta'),
  isAuthenticated: Boolean(localStorage.getItem('admin_jwta')),
  setToken: (token) => {
    localStorage.setItem('admin_jwta', token);
    set({ accessToken: token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('admin_jwta');
    set({ accessToken: null, isAuthenticated: false });
  },
}), { name: 'AdminAuthStore' }));
