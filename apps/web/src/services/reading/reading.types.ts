export interface ArticleDto {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface ArticleListResponse {
  items: ArticleDto[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateArticleDto {
  title: string;
  content: string;
}

export interface TranslateResponse {
  translation: string;
}
