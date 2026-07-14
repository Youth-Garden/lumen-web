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
  translation?: string;
  topic?:
    | 'GRAMMAR'
    | 'VOCABULARY'
    | 'COMPREHENSION'
    | 'LISTENING_DETAIL'
    | 'LISTENING_INFERENCE';
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

export interface SaveToeicNoteRequest {
  questionId: string;
  testId: string;
  content: string;
  category: string;
  tags: string[];
  quote?: string;
}
