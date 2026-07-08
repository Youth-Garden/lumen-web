import { AuthTokens } from './auth.types';

export const loginMapper = (raw: any): AuthTokens => {
  return {
    accessToken: raw?.accessToken || '',
    refreshToken: raw?.refreshToken || '',
    user: {
      id: raw?.user?.id || '',
      email: raw?.user?.email || '',
      role: raw?.user?.role || '',
    },
  };
};

export const registerMapper = (raw: any): any => {
  return raw;
};
