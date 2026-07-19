export enum ApiEndpointEnum {
  LOGIN = '/api/iam/login',
  EMAIL_OTP_SEND = '/api/iam/email-otp/send',
  REFRESH_TOKEN = '/api/iam/refresh',
  GET_ME = '/api/iam/me',
  UPDATE_PROFILE = '/api/iam/profile',
  LOGOUT = '/api/iam/logout',
  GOOGLE_LOGIN = '/api/iam/google-login',

  // Progress
  PROGRESS_DASHBOARD = '/api/progress/dashboard',
  PROGRESS_ACTIVITIES = '/api/progress/activities',
  PROGRESS_SETTINGS = '/api/progress/settings',
  PROGRESS_LEADERBOARD = '/api/progress/leaderboard',
  PROGRESS_BADGES = '/api/progress/badges',
  PROGRESS_HEATMAP = '/api/progress/heatmap',
  PROGRESS_STREAK_FREEZE = '/api/progress/streak-freeze',

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
  TOEIC_MISSING_EXPLANATIONS = '/api/toeic/admin/missing-explanations',

  // Material
  MATERIALS = '/api/materials',
  MATERIAL_DETAIL = '/api/materials/:id',
  MATERIAL_DICTATION = '/api/materials/dictation',

  // Exam Practice
  EXAM_PRACTICE_ATTEMPTS = '/api/exam-practice/attempts',
  EXAM_PRACTICE_MY_ATTEMPTS = '/api/exam-practice/attempts/me',
  EXAM_PRACTICE_ATTEMPT_DETAIL = '/api/exam-practice/attempts/:id',
  EXAM_PRACTICE_ATTEMPT_ANSWERS = '/api/exam-practice/attempts/:id/answers',
  EXAM_PRACTICE_ATTEMPT_FINISH = '/api/exam-practice/attempts/:id/finish',
  EXAM_PRACTICE_RETEST = '/api/exam-practice/attempts/:id/retest',
  EXAM_PRACTICE_ATTEMPT_PAUSE = '/api/exam-practice/attempts/:id/pause',
  EXAM_PRACTICE_ATTEMPT_RESUME = '/api/exam-practice/attempts/:id/resume',
  EXAM_PRACTICE_WEAKNESS_ANALYSIS = '/api/exam-practice/attempts/weakness-analysis',
  EXAM_PRACTICE_ADAPTIVE_DRILL = '/api/exam-practice/attempts/adaptive-drill',

  // Notifications
  NOTIFICATIONS = '/api/notifications',
  NOTIFICATION_MARK_READ = '/api/notifications/:id/read',
  NOTIFICATION_MARK_ALL_READ = '/api/notifications/read-all',
  NOTIFICATION_DEBUG = '/api/notifications/debug',

  // Grammar
  GRAMMAR_TOPICS = '/api/grammar/topics',
  GRAMMAR_TOPIC_DETAIL = '/api/grammar/topics/:id',
  GRAMMAR_LESSON_EXERCISES = '/api/grammar/lessons/:id/exercises',
  GRAMMAR_EXERCISE_SUBMIT = '/api/grammar/exercises/:id/submit',

  // Speaking
  SPEAKING_TASKS = '/api/listening-speaking/speaking-tasks',
  SPEAKING_TASK_SUBMIT = '/api/listening-speaking/speaking-tasks/:id/submit',
}

export const JWT_ACCESS_TOKEN_KEY = 'jwta';
export const JWT_REFRESH_TOKEN_KEY = 'jwtr';
