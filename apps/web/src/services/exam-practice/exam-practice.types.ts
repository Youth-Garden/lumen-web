export enum ExamAttemptStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
}

export enum ExamType {
  TOEIC = 'TOEIC',
  IELTS = 'IELTS',
}

export enum TestPlayerMode {
  TEST = 'test',
  RESULT = 'result',
  REVIEW = 'review',
}

export enum ExamAttemptMode {
  FULL = 'FULL',
  PART = 'PART',
  RETEST = 'RETEST',
}

export enum WeaknessLevelEnum {
  MASTERED = 'MASTERED',
  MODERATE = 'MODERATE',
  NEEDS_PRACTICE = 'NEEDS_PRACTICE',
}

export interface StartExamAttemptRequest {
  testId: string;
  testType: ExamType;
  mode?: ExamAttemptMode;
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
  userId: string;
  testId: string;
  testType: ExamType;
  status: ExamAttemptStatus;
  listeningScore: number;
  readingScore: number;
  totalScore: number;
  startedAt: string;
  completedAt?: string;
  mode: ExamAttemptMode;
  elapsedSeconds: number;
  customTimeLimit?: number;
  questionIds?: string[];
  answers: ExamPracticeAnswer[];
}

export interface AttemptSummary {
  id: string;
  testId: string;
  testTitle?: string;
  testType: ExamType;
  status: ExamAttemptStatus;
  mode: ExamAttemptMode;
  listeningScore: number;
  readingScore: number;
  totalScore: number;
  startedAt: string;
  completedAt?: string;
  totalAnswered: number;
  totalCorrect: number;
}

export interface PagingMeta {
  offset: number;
  limit: number;
  total: number;
}

export interface AttemptHistoryResponse {
  items: AttemptSummary[];
  paging: PagingMeta;
}

export interface PartMastery {
  partNumber: number;
  name: string;
  totalAttempted: number;
  correctCount: number;
  accuracyPercentage: number;
  weaknessLevel: WeaknessLevelEnum;
}

export interface WeaknessAnalysisResponse {
  partMasteries: PartMastery[];
  recommendedPartNumbers: number[];
  overallAccuracy: number;
}

export interface AdaptiveDrillQuestion {
  questionId: string;
  partNumber: number;
  prompt: string;
  options: string[];
  explanation?: string;
}

export interface AdaptiveDrillResponse {
  drillId: string;
  title: string;
  targetPartNumbers: number[];
  estimatedMinutes: number;
  questions: AdaptiveDrillQuestion[];
}
