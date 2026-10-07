export enum ActivityType {
  DICTATION_COMPLETED = 'dictation_completed',
  READING_COMPLETED = 'reading_completed',
  QUIZ_COMPLETED = 'quiz_completed',
  STREAK_ACHIEVED = 'streak_achieved',
  GRAMMAR_COMPLETED = 'grammar_completed',
  FLASHCARD_REVIEWED = 'flashcard_reviewed',
  SPEAKING_COMPLETED = 'speaking_completed',
}

export enum LeaderboardPeriodEnum {
  WEEKLY = 'weekly',
  ALL_TIME = 'all-time',
}

export interface DailyGoalHistoryItem {
  targetMinutes: number;
  effectiveFrom: string;
  effectiveTo?: string | null;
}

export interface DashboardProgressResponse {
  streak: number;
  lastActivityDate?: string;
  totalPoints: number;
  dailyGoalMinutes: number;
  todayStudyMinutes: number;
  streakFreezes: number;
  unlockedBadges?: string[];
  goalHistories?: DailyGoalHistoryItem[];
  frozenDates?: string[];
}

export interface HeatmapItem {
  date: string;
  count: number;
}

export interface UpdateProgressSettingsPayload {
  dailyGoalMinutes: number;
}

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  xpEarned: number;
  timestamp: string;
}

export enum BadgeType {
  FIRST_BLOOD = 'FIRST_BLOOD',
  STREAK_3_DAYS = 'STREAK_3_DAYS',
  STREAK_7_DAYS = 'STREAK_7_DAYS',
  STREAK_30_DAYS = 'STREAK_30_DAYS',
  XP_1000 = 'XP_1000',
  XP_5000 = 'XP_5000',
  GRAMMAR_MASTER = 'GRAMMAR_MASTER',
  VOCAB_NOVICE = 'VOCAB_NOVICE',
}

export interface LeaderboardUser {
  userId: string;
  fullName?: string;
  avatarUrl?: string;
  totalPoints: number;
  streak: number;
  unlockedBadges: BadgeType[];
}

export interface LeaderboardResponse {
  topUsers: LeaderboardUser[];
  currentUserRank?: number;
}
