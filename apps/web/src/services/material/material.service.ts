import { CoreService } from '../core';
import { ApiEndpointEnum } from '@/shared/constants';
import { BaseResponse } from '@lumen/shared-api';
import { registry } from './material.registry';
import {
  MaterialDto,
  DictationSubmissionDto,
  DictationResultDto,
} from './material.types';

export class MaterialService extends CoreService {
  async getMaterials(params?: {
    type?: string;
    category?: string;
    difficultyLevel?: string;
  }): Promise<BaseResponse<MaterialDto[]>> {
    return this._get<MaterialDto[]>(ApiEndpointEnum.MATERIALS, params);
  }

  async getMaterialById(id: string): Promise<BaseResponse<MaterialDto>> {
    return this._get<MaterialDto>(ApiEndpointEnum.MATERIAL_DETAIL, undefined, {
      pathParams: { id },
    });
  }

  async submitDictation(
    data: DictationSubmissionDto,
  ): Promise<BaseResponse<DictationResultDto>> {
    return this._post<DictationResultDto>(
      ApiEndpointEnum.MATERIAL_DICTATION,
      data,
    );
  }
}

export const materialService = MaterialService.getInstance(registry);
