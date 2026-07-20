export interface ArticleDto {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface CreateArticleDto {
  title: string;
  content: string;
}

export interface TranslateResponse {
  translatedText: string;
}
