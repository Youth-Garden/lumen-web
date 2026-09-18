export enum RouteEnum {
  WELCOME = '/welcome',
  LOGIN = '/login',
  DASHBOARD = '/',
  VOCABULARY = '/vocabulary',
  VOCABULARY_DUE = '/vocabulary/due',
  FOLDER_SELECTION = '/vocabulary/folders',
  FOLDER_DETAIL = '/vocabulary/folders/:id',
  FOLDER_TOPIC_DETAIL = '/vocabulary/folders/:id/topics/:topic',
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

export const PUBLIC_ROUTES = [RouteEnum.WELCOME, RouteEnum.LOGIN] as const;

export const NATIVE_LANGUAGE_STORAGE_KEY = 'lumen_native_language';
