export enum ApiEndpointEnum {
  LOGIN = '/iam/login',
  REGISTER = '/iam/register',
  REFRESH_TOKEN = '/iam/refresh',
  GET_ME = '/iam/me',
  LOGOUT = '/iam/logout',

  // Vocabulary
  VOCABULARY_WORDS = '/vocabulary/words',
  VOCABULARY_WORD_DETAIL = '/vocabulary/words/:id',
  VOCABULARY_DECKS = '/vocabulary/words/decks',
  VOCABULARY_FLASHCARDS = '/vocabulary/words/flashcards',
  VOCABULARY_FLASHCARDS_DUE = '/vocabulary/words/flashcards/due',
  VOCABULARY_FLASHCARDS_REVIEW = '/vocabulary/words/flashcards/review',

  // Quiz
  QUIZZES = '/quizzes',
  QUIZ_DETAIL = '/quizzes/:id',
  QUIZ_ANSWER = '/quizzes/:id/questions/:questionId/answers',
  QUIZ_FINISH = '/quizzes/:id/finish',

  // Reading
  READING_ARTICLES = '/reading/articles',
  READING_ARTICLE_DETAIL = '/reading/articles/:id',
  READING_TRANSLATE = '/reading/translate',

  // TOEIC
  TOEIC_TESTS = '/toeic/tests',
  TOEIC_TEST_DETAIL = '/toeic/tests/:id',
}
