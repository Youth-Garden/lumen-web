import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: localStorage.getItem('admin_access_token'),
  isAuthenticated: Boolean(localStorage.getItem('admin_access_token')),
  setToken: (token) => {
    localStorage.setItem('admin_access_token', token);
    set({ accessToken: token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('admin_access_token');
    set({ accessToken: null, isAuthenticated: false });
  },
}));
