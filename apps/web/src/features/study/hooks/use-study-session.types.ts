import type { VocabularyWord } from '@/services/vocabulary/vocabulary.types';

export interface MissedWordStat {
  card: VocabularyWord;
  errorCount: number;
}

export interface UseStudySessionProps {
  cards: VocabularyWord[];
  selectedTopic?: string | null;
  isOpen: boolean;
  onClose: () => void;
}
