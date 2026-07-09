export interface PresetQuiz {
  id: string;
  title: string;
  description: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PresetQuizListResponse {
  items: PresetQuiz[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreatePresetQuizDto {
  title: string;
  description: string;
  isPublished?: boolean;
}

export interface UpdatePresetQuizDto extends Partial<CreatePresetQuizDto> {}
