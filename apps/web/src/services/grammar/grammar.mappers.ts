import type {
  GrammarExerciseDto,
  GrammarLessonDto,
  GrammarTopicDto,
  GrammarTopicListResponse,
  SubmitExerciseResultDto,
} from './grammar.types';

const mapLesson = (raw: Record<string, unknown>): GrammarLessonDto => ({
  id: String(raw?.id ?? ''),
  title: String(raw?.title ?? ''),
  content: String(raw?.content ?? ''),
  orderIndex: Number(raw?.orderIndex ?? 0),
});

import { CefrLevelEnum } from '@/shared/types';

export const grammarTopicMapper = (
  raw: Record<string, unknown>,
): GrammarTopicDto => ({
  id: String(raw?.id ?? ''),
  title: String(raw?.title ?? ''),
  description: String(raw?.description ?? ''),
  cefrLevel: String(raw?.cefrLevel ?? '') as CefrLevelEnum,
  lessons: Array.isArray(raw?.lessons) ? raw.lessons.map(mapLesson) : undefined,
});

export const grammarTopicListMapper = (
  raw: Record<string, unknown>,
): GrammarTopicListResponse => ({
  items: Array.isArray(raw?.items) ? raw.items.map(grammarTopicMapper) : [],
  total: Number(raw?.total ?? 0),
  page: Number(raw?.page ?? 1),
  limit: Number(raw?.limit ?? 20),
});

export const grammarExerciseMapper = (
  raw: Record<string, unknown>,
): GrammarExerciseDto => ({
  id: String(raw?.id ?? ''),
  lessonId: String(raw?.lessonId ?? ''),
  questionText: String(raw?.questionText ?? ''),
  options: Array.isArray(raw?.options) ? raw.options.map(String) : [],
});

export const submitExerciseResultMapper = (
  raw: Record<string, unknown>,
): SubmitExerciseResultDto => ({
  isCorrect: Boolean(raw?.isCorrect),
  correctAnswer: String(raw?.correctAnswer ?? ''),
  explanation: String(raw?.explanation ?? ''),
});
