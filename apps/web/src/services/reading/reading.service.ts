import { CoreService } from '../core';
import { ApiEndpointEnum } from '@/shared/constants';
import { BaseResponse } from '@lumen/shared-api';
import { registry } from './reading.registry';
import {
  ArticleDto,
  ArticleListResponse,
  CreateArticleDto,
  TranslateResponse,
} from './reading.types';

export class ReadingService extends CoreService {
  getArticles(
    page: number = 1,
    limit: number = 20,
  ): Promise<BaseResponse<ArticleListResponse>> {
    return this._get<ArticleListResponse>(ApiEndpointEnum.READING_ARTICLES, {
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
