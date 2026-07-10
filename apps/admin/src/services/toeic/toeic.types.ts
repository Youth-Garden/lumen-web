export interface ToeicQuestionDto {
  id: string;
  part: number;
  questionNumber: number;
  questionText: string;
  options: string[];
  correctAnswer: number;
  audioUrl: string | null;
  imageUrl: string | null;
  explanation: string | null;
}

export interface ToeicTestDto {
  id: string;
  title: string;
  description: string | null;
  durationMinutes: number;
  status: 'Draft' | 'Published';
  questions: ToeicQuestionDto[];
  createdAt: string;
}

export interface ToeicTestListItem extends Omit<ToeicTestDto, 'questions'> {
  totalQuestions: number;
}

export interface ToeicTestListResponse {
  items: ToeicTestListItem[];
  meta: {
    currentPage: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface CreateToeicTestPayload {
  title: string;
  description?: string;
  durationMinutes: number;
}

export interface CreateToeicQuestionPayload {
  part: number;
  questionText: string;
  options: string[];
  correctAnswer: number;
  audioUrl?: string;
  imageUrl?: string;
  explanation?: string;
}
