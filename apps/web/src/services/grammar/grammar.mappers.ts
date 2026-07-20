import type {
  GrammarExerciseDto,
  GrammarLessonDto,
  GrammarTopicDto,
  SubmitExerciseResultDto,
} from './grammar.types';

import { CefrLevelEnum } from '@/shared/types';

const mapLesson = (raw: Record<string, unknown>): GrammarLessonDto => ({
  id: String(raw?.id ?? ''),
  title: String(raw?.title ?? ''),
  content: String(raw?.content ?? ''),
  orderIndex: Number(raw?.orderIndex ?? 0),
});

export const grammarTopicMapper = (
  raw: Record<string, unknown>,
): GrammarTopicDto => ({
  id: String(raw?.id ?? ''),
  title: String(raw?.title ?? ''),
  description: String(raw?.description ?? ''),
  cefrLevel: String(raw?.cefrLevel ?? '') as CefrLevelEnum,
  lessons: Array.isArray(raw?.lessons) ? raw.lessons.map(mapLesson) : undefined,
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
