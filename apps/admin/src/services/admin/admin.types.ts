export interface AdminUserGrowthDto {
  name: string;
  users: number;
}

export interface AdminContentDistributionDto {
  name: string;
  value: number;
  color: string;
}

export interface AdminWeeklyActivityDto {
  name: string;
  TOEIC: number;
  Vocabulary: number;
  Materials: number;
}

export interface AdminDashboardResponseDto {
  totalUsers: number;
  testsCompleted: number;
  materialViews: number;
  activeNow: number;
  userGrowth: AdminUserGrowthDto[];
  contentDistribution: AdminContentDistributionDto[];
  weeklyActivity: AdminWeeklyActivityDto[];
}
