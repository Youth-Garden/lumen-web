import { ApiEndpointEnum } from '@/shared/constants';
import { BaseResponse } from '@lumen/shared-api';
import { CoreService } from '../core';
import { registry } from './auth.registry';
import {
  AuthTokens,
  SendEmailOtpPayload,
  UpdateProfilePayload,
  UserInfo,
  VerifyEmailOtpPayload,
} from './auth.types';

export class AuthService extends CoreService {
  sendEmailOtp(payload: SendEmailOtpPayload): Promise<BaseResponse<void>> {
    return this._post<void>(ApiEndpointEnum.EMAIL_OTP_SEND, payload);
  }

  verifyEmailOtp(
    payload: VerifyEmailOtpPayload,
  ): Promise<BaseResponse<AuthTokens>> {
    return this._post<AuthTokens>(ApiEndpointEnum.LOGIN, payload);
  }

  googleLogin(idToken: string): Promise<BaseResponse<AuthTokens>> {
    return this._post<AuthTokens>(ApiEndpointEnum.GOOGLE_LOGIN, { idToken });
  }

  getMe(): Promise<BaseResponse<UserInfo>> {
    return this._get<UserInfo>(ApiEndpointEnum.GET_ME);
  }

  updateProfile(
    payload: UpdateProfilePayload,
  ): Promise<BaseResponse<UserInfo>> {
    return this._post<UserInfo>(ApiEndpointEnum.UPDATE_PROFILE, payload);
  }

  logout(): Promise<BaseResponse<void>> {
    return this._post<void>(ApiEndpointEnum.LOGOUT, {});
  }
}

export const authService = AuthService.getInstance(registry);
