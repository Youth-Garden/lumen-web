export enum ExamAttemptStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum ExamType {
  TOEIC = 'TOEIC',
  IELTS = 'IELTS',
}

export interface StartExamAttemptRequest {
  testId: string;
  testType: ExamType;
  mode?: string;
  partsAttempted?: number[];
  customTimeLimit?: number;
}

export interface StartExamAttemptResponse {
  id: string;
}

export interface SubmitExamAnswerRequest {
  questionId: string;
  userAnswer: string;
  timeSpent?: number;
  flaggedHard?: boolean;
}


export interface ExamPracticeAnswer {
  questionId: string;
  userAnswer: string;
  isCorrect?: boolean;
}

export interface ExamAttemptDetailResponse {
  id: string;
  testId: string;
  userId: string;
  testType: ExamType;
  status: ExamAttemptStatus;
  listeningScore: number;
  readingScore: number;
  totalScore: number;
  startedAt: string;
  completedAt?: string;
  answers: ExamPracticeAnswer[];
}
