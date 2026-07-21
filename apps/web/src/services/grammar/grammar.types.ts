import { CefrLevelEnum } from '@/shared/types';

export interface GrammarLessonDto {
  id: string;
  title: string;
  content: string;
  orderIndex: number;
}

export interface GrammarTopicDto {
  id: string;
  title: string;
  description: string;
  cefrLevel: CefrLevelEnum;
  category?: string | null;
  lessons?: GrammarLessonDto[];
}

export interface GrammarExerciseDto {
  id: string;
  lessonId: string;
  questionText: string;
  options: string[];
}

export interface SubmitExerciseRequest {
  answer: string;
}

export interface SubmitExerciseResultDto {
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string;
}
