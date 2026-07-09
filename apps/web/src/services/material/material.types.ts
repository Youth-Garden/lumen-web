export interface TranscriptDto {
  id: string;
  materialId: string;
  order: number;
  startTime: number;
  endTime: number;
  textEn: string;
  textVi: string;
}

export interface MaterialDto {
  id: string;
  title: string;
  description: string;
  sourceUrl: string;
  type: 'VIDEO' | 'AUDIO' | 'TEXT';
  difficultyLevel: string;
  category: string;
  tags: string[];
  transcripts: TranscriptDto[];
}

export interface DictationSubmissionDto {
  materialId: string;
  answers: {
    transcriptId: string;
    userInput: string;
  }[];
}

export interface DictationResultDto {
  materialId: string;
  score: number;
  results: {
    transcriptId: string;
    userInput: string;
    correctAnswer: string;
    isCorrect: boolean;
    diff: string | null;
  }[];
}
