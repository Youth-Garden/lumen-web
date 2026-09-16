export interface UserInfo {
  id: string;
  email: string;
  role: string;
  fullName?: string;
  avatarUrl?: string;
  phone?: string;
  createdAt?: string | Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: UserInfo;
}

export interface SendEmailOtpPayload {
  email: string;
}

export interface VerifyEmailOtpPayload {
  email: string;
  otp: string;
}

export interface UpdateProfilePayload {
  fullName?: string;
  avatarUrl?: string;
  phone?: string;
}
