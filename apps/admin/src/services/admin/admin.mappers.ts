import type { AdminDashboardResponseDto } from './admin.types';

export const adminDashboardMapper = (
  data: unknown,
): AdminDashboardResponseDto => {
  return data as AdminDashboardResponseDto;
};
