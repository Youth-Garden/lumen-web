export interface ToeicQuestionDto {
  id: string;
  testId: string;
  part: number;
  questionNumber: number;
  audioUrl?: string;
  imageUrl?: string;
  transcript?: string;
  questionText?: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  mediaUrls?: string[];
}

export interface ToeicTestDto {
  id: string;
  title: string;
  description?: string;
  isPublished: boolean;
  createdAt: string;
  questions: ToeicQuestionDto[];
}

export interface ToeicTestListItemDto {
  id: string;
  title: string;
  description?: string;
  isPublished: boolean;
  createdAt: string;
}

export interface ToeicTestListResponse {
  items: ToeicTestListItemDto[];
  total: number;
}
