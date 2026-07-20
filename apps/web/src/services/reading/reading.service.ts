import { CoreService } from '../core';
import { ApiEndpointEnum } from '@/shared/constants';
import { BaseResponse, Paging } from '@lumen/shared-api';
import { registry } from './reading.registry';
import {
  ArticleDto,
  CreateArticleDto,
  TranslateResponse,
} from './reading.types';

export class ReadingService extends CoreService {
  getArticles(
    page: number = 1,
    limit: number = 20,
  ): Promise<BaseResponse<Paging<ArticleDto>>> {
    return this._get<Paging<ArticleDto>>(ApiEndpointEnum.READING_ARTICLES, {
      params: { page, limit },
    });
  }

  getArticleById(id: string): Promise<BaseResponse<ArticleDto>> {
    return this._get<ArticleDto>(
      ApiEndpointEnum.READING_ARTICLE_DETAIL,
      undefined,
      {
        pathParams: { id },
      },
    );
  }

  createArticle(dto: CreateArticleDto): Promise<BaseResponse<{ id: string }>> {
    return this._post<{ id: string }>(ApiEndpointEnum.READING_ARTICLES, dto);
  }

  getPublicArticles(
    page: number = 1,
    limit: number = 6,
  ): Promise<BaseResponse<Paging<ArticleDto>>> {
    return this._get<Paging<ArticleDto>>(
      ApiEndpointEnum.READING_ARTICLES_PUBLIC,
      {
        params: { page, limit },
      },
    );
  }

  translateText(
    text: string,
    targetLanguage: string = 'vi',
  ): Promise<BaseResponse<TranslateResponse>> {
    return this._get<TranslateResponse>(ApiEndpointEnum.READING_TRANSLATE, {
      params: { text, targetLanguage },
    });
  }
}

export const readingService = ReadingService.getInstance(registry);
