export interface ToeicQuestionDto {
  id: string;
  part: number;
  questionNumber: number;
  audioUrl?: string;
  imageUrl?: string;
  questionText?: string;
  options: string[];
}

export interface ToeicTestDto {
  id: string;
  title: string;
  description?: string;
  questions: ToeicQuestionDto[];
}

export interface ToeicTestListResponse {
  items: Omit<ToeicTestDto, 'questions'>[];
  total: number;
}
