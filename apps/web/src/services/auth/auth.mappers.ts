import { AuthTokens } from './auth.types';

export const loginMapper = (raw: any): AuthTokens => {
  return {
    accessToken: raw?.accessToken || '',
    refreshToken: raw?.refreshToken || '',
    user: {
      id: raw?.user?.id || '',
      email: raw?.user?.email || '',
      role: raw?.user?.role || 'User',
    },
  };
};

export const getMeMapper = (raw: any): AuthTokens['user'] => {
  return {
    id: raw?.id || '',
    email: raw?.email || '',
    role: raw?.role || 'User',
  };
};
