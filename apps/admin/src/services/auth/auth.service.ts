import { ApiEndpointEnum } from '@/shared/constants';
import type { BaseResponse } from '@lumen/shared-api';
import { CoreService } from '../core';
import { registry } from './auth.registry';
import type { AuthResponse, LoginPayload } from './auth.types';

export class AuthService extends CoreService {
  login(payload: LoginPayload): Promise<BaseResponse<AuthResponse>> {
    return this._post<AuthResponse>(ApiEndpointEnum.LOGIN, payload);
  }

  googleLogin(idToken: string): Promise<BaseResponse<AuthResponse>> {
    return this._post<AuthResponse>(ApiEndpointEnum.GOOGLE_LOGIN, { idToken });
  }

  logout(): Promise<BaseResponse<void>> {
    return this._post<void>(ApiEndpointEnum.LOGOUT, {});
  }

  getMe(): Promise<BaseResponse<AuthResponse['user']>> {
    return this._get<AuthResponse['user']>(ApiEndpointEnum.GET_ME);
  }
}

export const authService = AuthService.getInstance(registry);
export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
};
