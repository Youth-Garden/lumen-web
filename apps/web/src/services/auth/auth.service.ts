import { CoreService } from '../core';
import { ApiEndpointEnum } from '@/shared/constants';
import { BaseResponse } from '@lumen/shared-api';
import { registry } from './auth.registry';
import {
  AuthTokens,
  LoginPayload,
  RegisterPayload,
  UserInfo,
  UpdateProfilePayload,
  LogoutPayload,
} from './auth.types';

export class AuthService extends CoreService {
  login(payload: LoginPayload): Promise<BaseResponse<AuthTokens>> {
    return this._post<AuthTokens>(ApiEndpointEnum.LOGIN, payload);
  }

  register(payload: RegisterPayload): Promise<BaseResponse<void>> {
    return this._post<void>(ApiEndpointEnum.REGISTER, payload);
  }

  getMe(): Promise<BaseResponse<UserInfo>> {
    return this._get<UserInfo>(ApiEndpointEnum.GET_ME);
  }

  updateProfile(payload: UpdateProfilePayload): Promise<BaseResponse<UserInfo>> {
    return this._post<UserInfo>(ApiEndpointEnum.UPDATE_PROFILE, payload);
  }

  logout(payload: LogoutPayload): Promise<BaseResponse<void>> {
    return this._post<void>(ApiEndpointEnum.LOGOUT, payload);
  }
}

export const authService = AuthService.getInstance(registry);
