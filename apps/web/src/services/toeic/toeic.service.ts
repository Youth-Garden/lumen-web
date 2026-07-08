import { WebApiService } from '../core';
import { ApiEndpointEnum } from '@/shared/constants';
import { BaseResponse } from '@lumen/shared-api';
import { registry } from './toeic.registry';
import { ToeicTestDto, ToeicTestListResponse } from './toeic.types';

class ToeicService extends WebApiService {
  getTests(): Promise<BaseResponse<ToeicTestListResponse>> {
    return this._get<ToeicTestListResponse>(ApiEndpointEnum.TOEIC_TESTS);
  }

  getTestById(id: string): Promise<BaseResponse<ToeicTestDto>> {
    return this._get<ToeicTestDto>(ApiEndpointEnum.TOEIC_TEST_DETAIL, undefined, {
      pathParams: { id },
    });
  }
}

export const toeicService = new ToeicService(registry);
