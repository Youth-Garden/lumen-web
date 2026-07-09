import { CoreService } from '../core';
import { ApiEndpointEnum } from '@/shared/constants';
import { registry } from './materials.registry';
import type { BaseResponse } from '@lumen/shared-api';
import type {
  CreateMaterialPayload,
  MaterialDto,
  MaterialListResponse,
  UpdateMaterialPayload,
} from './materials.types';

export class MaterialsService extends CoreService {
  listMaterials(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
  }): Promise<BaseResponse<MaterialListResponse>> {
    return this._get<MaterialListResponse>(ApiEndpointEnum.MATERIALS, {
      params,
    });
  }

  getMaterialById(id: string): Promise<BaseResponse<MaterialDto>> {
    return this._get<MaterialDto>(ApiEndpointEnum.MATERIAL_DETAIL, undefined, {
      pathParams: { id },
    });
  }

  createMaterial(
    payload: CreateMaterialPayload,
  ): Promise<BaseResponse<MaterialDto>> {
    return this._post<MaterialDto>(ApiEndpointEnum.MATERIALS, payload);
  }

  updateMaterial(
    id: string,
    payload: UpdateMaterialPayload,
  ): Promise<BaseResponse<MaterialDto>> {
    return this._put<MaterialDto>(ApiEndpointEnum.MATERIAL_DETAIL, payload, {
      pathParams: { id },
    });
  }

  deleteMaterial(id: string): Promise<BaseResponse<void>> {
    return this._delete<void>(ApiEndpointEnum.MATERIAL_DETAIL, {
      pathParams: { id },
    });
  }

  publishMaterial(id: string): Promise<BaseResponse<void>> {
    return this._post<void>(ApiEndpointEnum.MATERIAL_PUBLISH, undefined, {
      pathParams: { id },
    });
  }
}

export const materialsService = MaterialsService.getInstance(registry);
