import type { SpeakingTaskDto, SpeechResultDto } from './speaking.types';

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
