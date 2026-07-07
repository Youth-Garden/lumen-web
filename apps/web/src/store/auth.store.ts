import { create } from 'zustand';
import Cookies from 'js-cookie';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  
  setAuth: (user: User, token: string, refreshToken?: string) => void;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
}

// Ensure cookie reads only happen on the client
const getInitialToken = () => {
  if (typeof window !== 'undefined') {
    return Cookies.get('access_token') || null;
  }
  return null;
};

const initialToken = getInitialToken();

export const useAuthStore = create<AuthState>((set) => ({
  user: null, // Note: We only persist the token in cookies for middleware. User info should be fetched on initial load or persisted in localStorage separately.
  accessToken: initialToken,
  isAuthenticated: !!initialToken,

  setAuth: (user, token, refreshToken) => {
    Cookies.set('access_token', token, { expires: 7, secure: true, sameSite: 'lax' });
    if (refreshToken) {
      Cookies.set('refresh_token', refreshToken, { expires: 30, secure: true, sameSite: 'lax' });
    }
    set({ user, accessToken: token, isAuthenticated: true });
  },
  
  updateUser: (userUpdates) => set((state) => ({
    user: state.user ? { ...state.user, ...userUpdates } : null
  })),

  logout: () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    set({ user: null, accessToken: null, isAuthenticated: false });
  },
}));
