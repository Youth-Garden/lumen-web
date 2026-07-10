export interface StartExamAttemptRequest {
  testId: string;
  testType: string;
}

export interface StartExamAttemptResponse {
  id: string;
}

export interface SubmitExamAnswerRequest {
  questionId: string;
  userAnswer: string;
}

export interface ExamPracticeAnswer {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
}

export interface ExamAttemptDetailResponse {
  id: string;
  testId: string;
  userId: string;
  totalScore: number;
  status: string;
  answers: ExamPracticeAnswer[];
}
