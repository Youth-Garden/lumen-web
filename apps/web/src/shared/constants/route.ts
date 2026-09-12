export enum RouteEnum {
  WELCOME = '/welcome',
  LOGIN = '/login',
  DASHBOARD = '/',
  VOCABULARY = '/vocabulary',
  FOLDER_DETAIL = '/vocabulary/folders/:id',
  STUDY = '/study',
  QUIZ = '/quiz',
  QUIZ_SESSION = '/quiz/:id',
  TOEIC = '/toeic',
  TOEIC_TEST = '/toeic/:id',
  EXAM_RESULT = '/toeic/:id/result',
  READING = '/reading',
  ARTICLE_READER = '/reading/:id',
  DICTATION = '/dictation',
  DICTATION_EXERCISE = '/dictation/:id',
  FLASHCARD_REVIEW = '/vocabulary/review',
  PROFILE = '/profile',
  SETTINGS = '/settings',
  GRAMMAR = '/grammar',
  GRAMMAR_TOPIC = '/grammar/:id',
  SPEAKING = '/speaking',
  SPEAKING_TASK = '/speaking/:id',
}

export const ONBOARDING_ROUTES = [RouteEnum.WELCOME] as const;
export const PUBLIC_AUTH_ROUTES = [RouteEnum.LOGIN] as const;
export const PUBLIC_ROUTES = [
  ...ONBOARDING_ROUTES,
  ...PUBLIC_AUTH_ROUTES,
] as const;

export const LEARNING_ROUTES = [
  RouteEnum.DASHBOARD,
  RouteEnum.VOCABULARY,
  RouteEnum.FOLDER_DETAIL,
  RouteEnum.STUDY,
  RouteEnum.QUIZ,
  RouteEnum.QUIZ_SESSION,
  RouteEnum.TOEIC,
  RouteEnum.TOEIC_TEST,
  RouteEnum.EXAM_RESULT,
  RouteEnum.READING,
  RouteEnum.ARTICLE_READER,
  RouteEnum.DICTATION,
  RouteEnum.DICTATION_EXERCISE,
  RouteEnum.FLASHCARD_REVIEW,
  RouteEnum.GRAMMAR,
  RouteEnum.GRAMMAR_TOPIC,
  RouteEnum.SPEAKING,
  RouteEnum.SPEAKING_TASK,
] as const;

export const USER_ACCOUNT_ROUTES = [
  RouteEnum.PROFILE,
  RouteEnum.SETTINGS,
] as const;

export const NATIVE_LANGUAGE_STORAGE_KEY = 'lumen_native_language';
