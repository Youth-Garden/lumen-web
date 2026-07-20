import { ApiEndpointEnum } from '@/shared/constants';
import { BaseResponse, Paging } from '@lumen/shared-api';
import { CoreService } from '../core';
import { registry } from './speaking.registry';
import type {
  SpeakingTaskDto,
  SpeechResultDto,
  SubmitSpeechRequest,
} from './speaking.types';

export class SpeakingService extends CoreService {
  getTasks(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<BaseResponse<Paging<SpeakingTaskDto>>> {
    return this._get<Paging<SpeakingTaskDto>>(ApiEndpointEnum.SPEAKING_TASKS, {
      params,
    });
  }

  submitSpeech(
    taskId: string,
    data: SubmitSpeechRequest,
  ): Promise<BaseResponse<SpeechResultDto>> {
    return this._post<SpeechResultDto>(
      ApiEndpointEnum.SPEAKING_TASK_SUBMIT,
      data,
      { pathParams: { id: taskId } },
    );
  }
}

export const speakingService = SpeakingService.getInstance(registry);
