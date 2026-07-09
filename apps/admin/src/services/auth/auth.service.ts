import { CoreService } from '../core';
import { ApiEndpointEnum } from '@/shared/constants';
import { registry } from './auth.registry';
import type { BaseResponse } from '@lumen/shared-api';
import type { AuthResponse, LoginPayload } from './auth.types';

export class AuthService extends CoreService {
  login(payload: LoginPayload): Promise<BaseResponse<AuthResponse>> {
    return this._post<AuthResponse>(ApiEndpointEnum.LOGIN, payload);
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
