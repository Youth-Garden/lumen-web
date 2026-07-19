import { CoreService } from '../core';
import { ApiEndpointEnum } from '@/shared/constants';
import type { AdminDashboardResponseDto } from './admin.types';
import { registry } from './admin.registry';
import type { BaseResponse } from '@lumen/shared-api';

class AdminService extends CoreService {
  getDashboard(): Promise<BaseResponse<AdminDashboardResponseDto>> {
    return this._get<AdminDashboardResponseDto>(
      ApiEndpointEnum.ADMIN_DASHBOARD,
    );
  }
}

export const adminService = AdminService.getInstance(registry);
