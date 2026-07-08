import { WebApiService } from '../core';
import { ApiEndpointEnum } from '@/shared/constants';
import { AuthTokens, LoginPayload, RegisterPayload } from './auth.types';
import { BaseResponse } from '@lumen/shared-api';
import { registry } from './auth.registry';

class AuthService extends WebApiService {
  login(payload: LoginPayload): Promise<BaseResponse<AuthTokens>> {
    return this._post<AuthTokens>(ApiEndpointEnum.LOGIN, payload);
  }

  register(payload: RegisterPayload): Promise<BaseResponse<any>> {
    return this._post(ApiEndpointEnum.REGISTER, payload);
  }
}

export const authService = new AuthService(registry);
