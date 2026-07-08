import { create } from 'zustand';
import Cookies from 'js-cookie';
import { authService } from '@/services/auth';

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  setAuth: (user: User, token: string, refreshToken?: string) => void;
  updateUser: (user: Partial<User>) => void;
  loadProfile: () => Promise<void>;
  logout: () => Promise<void>;
}

// Ensure cookie reads only happen on the client
const getInitialToken = () => {
  if (typeof window !== 'undefined') {
    return Cookies.get('access_token') || null;
  }
  return null;
};

const initialToken = getInitialToken();

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: initialToken,
  isAuthenticated: !!initialToken,
  isLoading: true, // Start in loading state until profile is fetched

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

  loadProfile: async () => {
    const { accessToken } = get();
    if (!accessToken) {
      set({ isLoading: false });
      return;
    }

    try {
      const res = await authService.getMe();
      if (res.data) {
        set({ user: res.data as User, isAuthenticated: true });
      }
    } catch (error) {
      // If fetching profile fails (e.g., token expired and refresh fails), clear auth
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      set({ user: null, accessToken: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    const refreshToken = Cookies.get('refresh_token');
    
    // Optimistically clear local state immediately for snappy UI
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    set({ user: null, accessToken: null, isAuthenticated: false });

    // Call API in background if refresh token exists
    if (refreshToken) {
      try {
        await authService.logout({ refreshToken });
      } catch (error) {
        // Ignore logout errors
      }
    }
  },
}));
