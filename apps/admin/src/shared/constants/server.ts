export const ApiEndpointEnum = {
  // Auth (Admin)
  LOGIN: '/api/iam/login',
  GOOGLE_LOGIN: '/api/iam/google-login',
  LOGOUT: '/api/iam/logout',
  REFRESH_TOKEN: '/api/iam/refresh',
  GET_ME: '/api/iam/me',

  // Users (Admin management)
  USERS: '/api/iam/users',
  USER_DETAIL: '/api/iam/users/:id',
  USER_BAN: '/api/iam/users/:id/ban',
  USER_UNBAN: '/api/iam/users/:id/unban',

  // TOEIC Tests (Admin management)
  TOEIC_TESTS: '/api/toeic/tests',
  TOEIC_TEST_DETAIL: '/api/toeic/tests/:id',
  TOEIC_TEST_PUBLISH: '/api/toeic/tests/:id/publish',
  TOEIC_MISSING_EXPLANATIONS: '/api/toeic/admin/missing-explanations',
  TOEIC_UPDATE_EXPLANATION: '/api/toeic/questions/:id/explanation',

  // Vocabulary (Admin management)
  VOCABULARY_WORDS: '/api/vocabulary/words',
  VOCABULARY_WORD_DETAIL: '/api/vocabulary/words/:id',

  // Materials (Admin management)
  MATERIALS: '/api/materials',
  MATERIAL_DETAIL: '/api/materials/:id',
  MATERIAL_PUBLISH: '/api/materials/:id/publish',
} as const;
