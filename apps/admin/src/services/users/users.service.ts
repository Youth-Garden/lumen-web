import { AdminApiService } from '../core';
import { ApiEndpointEnum } from '@/shared/constants';
import type { BaseResponse as BaseResponseType } from '@lumen/shared-api';
import { registry } from './users.registry';
import type { AdminUser, CreateUserPayload, UpdateUserPayload, UserListResponse } from './users.types';

class UsersService extends AdminApiService {
  listUsers(params?: { page?: number; limit?: number; search?: string; role?: string; status?: string }): Promise<BaseResponseType<UserListResponse>> {
    return this._get<UserListResponse>(ApiEndpointEnum.USERS, { params });
  }

  getUserById(id: string): Promise<BaseResponseType<AdminUser>> {
    return this._get<AdminUser>(ApiEndpointEnum.USER_DETAIL, undefined, { pathParams: { id } });
  }

  createUser(payload: CreateUserPayload): Promise<BaseResponseType<AdminUser>> {
    return this._post<AdminUser>(ApiEndpointEnum.USERS, payload);
  }

  updateUser(id: string, payload: UpdateUserPayload): Promise<BaseResponseType<AdminUser>> {
    return this._put<AdminUser>(ApiEndpointEnum.USER_DETAIL, payload, { pathParams: { id } });
  }

  deleteUser(id: string): Promise<BaseResponseType<void>> {
    return this._delete<void>(ApiEndpointEnum.USER_DETAIL, { pathParams: { id } });
  }

  banUser(id: string): Promise<BaseResponseType<void>> {
    return this._post<void>(ApiEndpointEnum.USER_BAN, undefined, { pathParams: { id } });
  }

  unbanUser(id: string): Promise<BaseResponseType<void>> {
    return this._post<void>(ApiEndpointEnum.USER_UNBAN, undefined, { pathParams: { id } });
  }
}

export const usersService = new UsersService(registry);
