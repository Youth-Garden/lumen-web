export enum ApiEndpointEnum {
  LOGIN = '/api/iam/login',
  EMAIL_OTP_SEND = '/api/iam/email-otp/send',
  REFRESH_TOKEN = '/api/iam/refresh',
  GET_ME = '/api/iam/me',
  UPDATE_PROFILE = '/api/iam/profile',
  LOGOUT = '/api/iam/logout',
  GOOGLE_LOGIN = '/api/iam/google-login',

  PROGRESS_DASHBOARD = '/api/progress/dashboard',
  PROGRESS_ACTIVITIES = '/api/progress/activities',
  PROGRESS_SETTINGS = '/api/progress/settings',
  PROGRESS_LEADERBOARD = '/api/progress/leaderboard',
  PROGRESS_BADGES = '/api/progress/badges',
  PROGRESS_HEATMAP = '/api/progress/heatmap',
  PROGRESS_STREAK_FREEZE = '/api/progress/streak-freeze',

  VOCABULARY_WORDS = '/api/vocabulary/words',
  VOCABULARY_WORD_DETAIL = '/api/vocabulary/words/:id',
  VOCABULARY_FOLDERS = '/api/vocabulary/words/folders',
  VOCABULARY_FOLDER_DETAIL = '/api/vocabulary/words/folders/:id',
  VOCABULARY_FLASHCARDS = '/api/vocabulary/words/flashcards',

  STUDY_FLASHCARDS_DUE = '/api/vocabulary/words/flashcards/due',
  STUDY_FLASHCARDS_REVIEW = '/api/vocabulary/words/flashcards/review',

  MATERIALS = '/api/materials',
  MATERIAL_DETAIL = '/api/materials/:id',
  MATERIAL_DICTATION = '/api/materials/dictation',

  NOTIFICATIONS = '/api/notifications',
  NOTIFICATION_MARK_READ = '/api/notifications/:id/read',
  NOTIFICATION_MARK_ALL_READ = '/api/notifications/read-all',
  NOTIFICATION_DEBUG = '/api/notifications/debug',
}

export const JWT_ACCESS_TOKEN_KEY = 'jwta';
export const JWT_REFRESH_TOKEN_KEY = 'jwtr';
