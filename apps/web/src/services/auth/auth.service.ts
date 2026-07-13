import { ApiEndpointEnum } from '@/shared/constants';
import { BaseResponse } from '@lumen/shared-api';
import { CoreService } from '../core';
import { registry } from './auth.registry';
import {
  AuthTokens,
  ForgotPasswordPayload,
  LoginPayload,
  LogoutPayload,
  RegisterPayload,
  ResetPasswordPayload,
  UpdateProfilePayload,
  UserInfo,
} from './auth.types';

export class AuthService extends CoreService {
  login(payload: LoginPayload): Promise<BaseResponse<AuthTokens>> {
    return this._post<AuthTokens>(ApiEndpointEnum.LOGIN, payload);
  }

  googleLogin(idToken: string): Promise<BaseResponse<AuthTokens>> {
    return this._post<AuthTokens>(ApiEndpointEnum.GOOGLE_LOGIN, { idToken });
  }

  register(payload: RegisterPayload): Promise<BaseResponse<void>> {
    return this._post<void>(ApiEndpointEnum.REGISTER, payload);
  }

  getMe(): Promise<BaseResponse<UserInfo>> {
    return this._get<UserInfo>(ApiEndpointEnum.GET_ME);
  }

  updateProfile(
    payload: UpdateProfilePayload,
  ): Promise<BaseResponse<UserInfo>> {
    return this._post<UserInfo>(ApiEndpointEnum.UPDATE_PROFILE, payload);
  }

  logout(payload: LogoutPayload): Promise<BaseResponse<void>> {
    return this._post<void>(ApiEndpointEnum.LOGOUT, payload);
  }

  forgotPassword(payload: ForgotPasswordPayload): Promise<BaseResponse<void>> {
    return this._post<void>(ApiEndpointEnum.FORGOT_PASSWORD, payload);
  }

  resetPassword(payload: ResetPasswordPayload): Promise<BaseResponse<void>> {
    return this._post<void>(ApiEndpointEnum.RESET_PASSWORD, payload);
  }
}

export const authService = AuthService.getInstance(registry);
