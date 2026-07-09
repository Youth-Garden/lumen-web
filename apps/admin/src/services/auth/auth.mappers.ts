import type { AuthResponse } from './auth.types';

export const authUserMapper = (raw: any): AuthResponse['user'] => ({
  id: raw?.id ? String(raw.id) : '',
  email: raw?.email ?? '',
  name: raw?.name ?? '',
  role: raw?.role ?? 'Learner',
});

export const authResponseMapper = (raw: any): AuthResponse => ({
  accessToken: raw?.accessToken ?? '',
  refreshToken: raw?.refreshToken ?? '',
  user: authUserMapper(raw?.user ?? {}),
});
