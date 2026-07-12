export enum ActivityType {
  DICTATION_COMPLETED = 'dictation_completed',
  READING_COMPLETED = 'reading_completed',
  QUIZ_COMPLETED = 'quiz_completed',
  STREAK_ACHIEVED = 'streak_achieved',
  GRAMMAR_COMPLETED = 'grammar_completed',
  FLASHCARD_REVIEWED = 'flashcard_reviewed',
  SPEAKING_COMPLETED = 'speaking_completed',
}

export interface DashboardProgressResponse {
  streak: number;
  totalPoints: number;
  dailyGoalMinutes: number;
  todayStudyMinutes: number;
  weeklyData?: { date: string; xp: number }[];
}

export interface UpdateProgressSettingsPayload {
  dailyGoalMinutes?: number;
}

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  xpEarned: number;
  timestamp: Date;
}
