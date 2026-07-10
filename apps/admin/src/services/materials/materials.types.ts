export interface MaterialDto {
  id: string;
  title: string;
  category: 'Reading' | 'Listening';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  content: string;
  audioUrl: string | null;
  coverImageUrl: string | null;
  tags: string[];
  views: number;
  status: 'Draft' | 'Published';
  createdAt: string;
}

export interface MaterialListResponse {
  items: Omit<MaterialDto, 'content'>[];
  meta: {
    currentPage: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface CreateMaterialPayload {
  title: string;
  category: 'Reading' | 'Listening';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  content: string;
  tags?: string[];
  audioUrl?: string;
  coverImageUrl?: string;
}

export type UpdateMaterialPayload = Partial<CreateMaterialPayload> & {
  status?: 'Draft' | 'Published';
};
