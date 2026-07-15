import type {
  SpeakingTaskDto,
  SpeakingTaskListResponse,
  SpeechResultDto,
} from './speaking.types';

export const speakingTaskMapper = (
  raw: Record<string, unknown>,
): SpeakingTaskDto => ({
  id: String(raw?.id ?? ''),
  title: String(raw?.title ?? ''),
  prompt: String(raw?.prompt ?? ''),
  referenceAudioUrl: raw?.referenceAudioUrl
    ? String(raw.referenceAudioUrl)
    : null,
  keywords: Array.isArray(raw?.keywords) ? raw.keywords.map(String) : [],
});

export const speakingTaskListMapper = (
  raw: Record<string, unknown>,
): SpeakingTaskListResponse => ({
  items: Array.isArray(raw?.items) ? raw.items.map(speakingTaskMapper) : [],
  total: Number(raw?.total ?? 0),
  page: Number(raw?.page ?? 1),
  limit: Number(raw?.limit ?? 10),
});

export const speechResultMapper = (
  raw: Record<string, unknown>,
): SpeechResultDto => ({
  id: String(raw?.id ?? ''),
  userId: String(raw?.userId ?? ''),
  speakingTaskId: String(raw?.speakingTaskId ?? ''),
  audioUrl: String(raw?.audioUrl ?? ''),
  accuracyScore: Number(raw?.accuracyScore ?? 0),
  feedback: String(raw?.feedback ?? ''),
});
