export enum ApiEndpointEnum {
  LOGIN = '/api/iam/login',
  REGISTER = '/api/iam/register',
  REFRESH_TOKEN = '/api/iam/refresh',
  GET_ME = '/api/iam/me',
  UPDATE_PROFILE = '/api/iam/profile',
  LOGOUT = '/api/iam/logout',
  GOOGLE_LOGIN = '/api/iam/google-login',
  FORGOT_PASSWORD = '/api/iam/forgot-password',
  RESET_PASSWORD = '/api/iam/reset-password',

  // Progress
  PROGRESS_DASHBOARD = '/api/progress/dashboard',
  PROGRESS_ACTIVITIES = '/api/progress/activities',
  PROGRESS_SETTINGS = '/api/progress/settings',
  PROGRESS_LEADERBOARD = '/api/progress/leaderboard',
  PROGRESS_BADGES = '/api/progress/badges',

  // Vocabulary
  VOCABULARY_WORDS = '/api/vocabulary/words',
  VOCABULARY_WORD_DETAIL = '/api/vocabulary/words/:id',
  VOCABULARY_DECKS = '/api/vocabulary/words/decks',
  VOCABULARY_FLASHCARDS = '/api/vocabulary/words/flashcards',
  VOCABULARY_FLASHCARDS_DUE = '/api/vocabulary/words/flashcards/due',
  VOCABULARY_FLASHCARDS_REVIEW = '/api/vocabulary/words/flashcards/review',
  USER_VOCABULARY = '/api/vocabulary/users',

  // Quiz
  QUIZZES = '/api/quizzes',
  QUIZ_GENERATE = '/api/quizzes/generate',
  QUIZ_DETAIL = '/api/quizzes/:id',
  QUIZ_ANSWER = '/api/quizzes/:id/questions/:questionId/answers',
  QUIZ_FINISH = '/api/quizzes/:id/finish',

  // Reading
  READING_ARTICLES = '/api/reading/articles',
  READING_ARTICLES_PUBLIC = '/api/reading/articles/public',
  READING_ARTICLE_DETAIL = '/api/reading/articles/:id',
  READING_TRANSLATE = '/api/reading/translate',

  // TOEIC
  TOEIC_TESTS = '/api/toeic/tests',
  TOEIC_TEST_DETAIL = '/api/toeic/tests/:id',
  TOEIC_NOTES = '/api/toeic/notes',
  TOEIC_QUESTION_EXPLANATION = '/api/toeic/questions/:id/explanation',

  // Material
  MATERIALS = '/api/materials',
  MATERIAL_DETAIL = '/api/materials/:id',
  MATERIAL_DICTATION = '/api/materials/dictation',

  // Exam Practice
  EXAM_PRACTICE_ATTEMPTS = '/api/exam-practice/attempts',
  EXAM_PRACTICE_ATTEMPT_DETAIL = '/api/exam-practice/attempts/:id',
  EXAM_PRACTICE_ATTEMPT_ANSWERS = '/api/exam-practice/attempts/:id/answers',
  EXAM_PRACTICE_ATTEMPT_FINISH = '/api/exam-practice/attempts/:id/finish',

  // Notifications
  NOTIFICATIONS = '/api/notifications',
  NOTIFICATION_MARK_READ = '/api/notifications/:id/read',
  NOTIFICATION_MARK_ALL_READ = '/api/notifications/read-all',
  NOTIFICATION_DEBUG = '/api/notifications/debug',
}

export const JWT_ACCESS_TOKEN_KEY = 'jwta';
export const JWT_REFRESH_TOKEN_KEY = 'jwtr';
