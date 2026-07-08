import { WebApiService } from '../core';
import { ApiEndpointEnum } from '@/shared/constants';
import { AuthTokens, LoginPayload, RegisterPayload, LogoutPayload, UserInfo, UpdateProfilePayload } from './auth.types';
import { BaseResponse } from '@lumen/shared-api';
import { registry } from './auth.registry';

class AuthService extends WebApiService {
  login(payload: LoginPayload): Promise<BaseResponse<AuthTokens>> {
    return this._post<AuthTokens>(ApiEndpointEnum.LOGIN, payload);
  }

  register(payload: RegisterPayload): Promise<BaseResponse<any>> {
    return this._post(ApiEndpointEnum.REGISTER, payload);
  }

  getMe(): Promise<BaseResponse<UserInfo>> {
    return this._get<UserInfo>(ApiEndpointEnum.GET_ME);
  }

  logout(payload: LogoutPayload): Promise<BaseResponse<any>> {
    return this._post(ApiEndpointEnum.LOGOUT, payload);
  }

  updateProfile(payload: UpdateProfilePayload): Promise<BaseResponse<UserInfo>> {
    return this._put<UserInfo>(ApiEndpointEnum.UPDATE_PROFILE, payload);
  }
}

export const authService = new AuthService(registry);
