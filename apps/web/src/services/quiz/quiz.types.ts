export enum QuizStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
}

export interface GenerateQuizDto {
  limit: number;
}

export interface SubmitAnswerDto {
  answer: string;
}

export interface GenerateQuizResponseDto {
  id: string;
}

export interface FinishQuizResponseDto {
  score: number;
}

export interface QuestionDetailDto {
  id: string;
  type: QuestionType | string;
  questionText: string;
  options?: string[];
  userAnswer?: string;
  correctAnswer?: string;
  isCorrect?: boolean;
}

export interface QuizDetailResponseDto {
  id: string;
  status: QuizStatus | string;
  score: number;
  questions: QuestionDetailDto[];
  createdAt: string;
  completedAt?: string;
}

export interface QuizListItemDto {
  id: string;
  status: QuizStatus | string;
  score: number;
  createdAt: string;
  completedAt?: string;
}

export interface QuizListResponseDto {
  items: QuizListItemDto[];
  total: number;
  page: number;
  limit: number;
}
