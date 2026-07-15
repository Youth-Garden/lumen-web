export interface SpeakingTaskDto {
  id: string;
  title: string;
  prompt: string;
  referenceAudioUrl: string | null;
  keywords: string[];
}

export interface SpeakingTaskListResponse {
  items: SpeakingTaskDto[];
  total: number;
  page: number;
  limit: number;
}

export interface SubmitSpeechRequest {
  audioUrl: string;
}

export interface SpeechResultDto {
  id: string;
  userId: string;
  speakingTaskId: string;
  audioUrl: string;
  accuracyScore: number;
  feedback: string;
}
