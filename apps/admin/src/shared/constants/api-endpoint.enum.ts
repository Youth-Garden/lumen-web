export const ApiEndpointEnum = {
  // Auth (Admin)
  LOGIN: '/iam/login',
  LOGOUT: '/iam/logout',
  REFRESH_TOKEN: '/iam/refresh',
  GET_ME: '/iam/me',

  // Users (Admin management)
  USERS: '/iam/users',
  USER_DETAIL: '/iam/users/:id',
  USER_BAN: '/iam/users/:id/ban',
  USER_UNBAN: '/iam/users/:id/unban',

  // TOEIC Tests (Admin management)
  TOEIC_TESTS: '/toeic/tests',
  TOEIC_TEST_DETAIL: '/toeic/tests/:id',
  TOEIC_TEST_PUBLISH: '/toeic/tests/:id/publish',

  // Vocabulary (Admin management)
  VOCABULARY_WORDS: '/vocabulary/words',
  VOCABULARY_WORD_DETAIL: '/vocabulary/words/:id',

  // Materials (Admin management)
  MATERIALS: '/materials',
  MATERIAL_DETAIL: '/materials/:id',
  MATERIAL_PUBLISH: '/materials/:id/publish',
} as const;

export type ApiEndpointEnum = typeof ApiEndpointEnum[keyof typeof ApiEndpointEnum];
