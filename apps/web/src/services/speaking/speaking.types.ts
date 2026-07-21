export interface SpeakingTaskDto {
  id: string;
  title: string;
  prompt: string;
  referenceAudioUrl: string | null;
  keywords: string[];
  category?: string | null;
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
