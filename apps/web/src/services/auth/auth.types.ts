export interface UserInfo {
  id: string;
  email: string;
  role: string;
  fullName?: string;
  avatarUrl?: string;
  phone?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: UserInfo;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
}

export interface UpdateProfilePayload {
  fullName?: string;
  avatarUrl?: string;
  phone?: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}
