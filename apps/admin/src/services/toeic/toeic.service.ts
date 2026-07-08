import { AdminApiService } from '../core';
import { ApiEndpointEnum } from '@/shared/constants';
import { registry } from './toeic.registry';
import type { BaseResponse } from '@lumen/shared-api';
import type { CreateToeicQuestionPayload, CreateToeicTestPayload, ToeicTestDto, ToeicTestListResponse } from './toeic.types';

class ToeicAdminService extends AdminApiService {
  listTests(params?: { page?: number; limit?: number; search?: string; status?: string }): Promise<BaseResponse<ToeicTestListResponse>> {
    return this._get<ToeicTestListResponse>(ApiEndpointEnum.TOEIC_TESTS, { params });
  }

  getTestById(id: string): Promise<BaseResponse<ToeicTestDto>> {
    return this._get<ToeicTestDto>(ApiEndpointEnum.TOEIC_TEST_DETAIL, undefined, { pathParams: { id } });
  }

  createTest(payload: CreateToeicTestPayload): Promise<BaseResponse<ToeicTestDto>> {
    return this._post<ToeicTestDto>(ApiEndpointEnum.TOEIC_TESTS, payload);
  }

  updateTest(id: string, payload: Partial<CreateToeicTestPayload> & { questions?: CreateToeicQuestionPayload[] }): Promise<BaseResponse<ToeicTestDto>> {
    return this._put<ToeicTestDto>(ApiEndpointEnum.TOEIC_TEST_DETAIL, payload, { pathParams: { id } });
  }

  deleteTest(id: string): Promise<BaseResponse<void>> {
    return this._delete<void>(ApiEndpointEnum.TOEIC_TEST_DETAIL, { pathParams: { id } });
  }

  publishTest(id: string): Promise<BaseResponse<void>> {
    return this._post<void>(ApiEndpointEnum.TOEIC_TEST_PUBLISH, undefined, { pathParams: { id } });
  }
}

export const toeicAdminService = new ToeicAdminService(registry);
