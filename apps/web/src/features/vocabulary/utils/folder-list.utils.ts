import type {
  Folder,
  MemoryStageLevel,
  VocabularyOverview,
  VocabularyWord,
} from '@/services/vocabulary';

export function calculateGlobalTotalWords(folders: Folder[]): number {
  return folders.reduce((sum, folder) => sum + (folder.flashcardCount || 0), 0);
}

export function extractGlobalDueCards(
  cards: VocabularyWord[],
): VocabularyWord[] {
  return cards.filter(
    (card) =>
      ((card.level ?? 0) >= 1 || (card.learningStep ?? 0) >= 5) &&
      Boolean(card.isWilted),
  );
}

export function extractFrequentlyMissedCards(
  cards: VocabularyWord[],
  limit = 3,
): VocabularyWord[] {
  const seen = new Set<string>();
  const list: VocabularyWord[] = [];
  for (const card of cards) {
    const termKey = card.term.toLowerCase().trim();
    if (!seen.has(termKey) && Boolean(card.isWilted)) {
      seen.add(termKey);
      list.push(card);
    }
  }
  return list.slice(0, limit);
}

export function calculateGlobalStages(
  allFlashcards: VocabularyWord[],
  overviewData?: VocabularyOverview,
): { globalLearnedCount: number; stages: MemoryStageLevel[] } {
  if (overviewData?.memoryLevels && overviewData.memoryLevels.length === 5) {
    return {
      globalLearnedCount: overviewData.totalLearnedWords,
      stages: overviewData.memoryLevels,
    };
  }

  const stage1Count = allFlashcards.filter(
    (card) => (card.level ?? 0) === 1,
  ).length;
  const stage2Count = allFlashcards.filter(
    (card) => (card.level ?? 0) === 2,
  ).length;
  const stage3Count = allFlashcards.filter(
    (card) => (card.level ?? 0) === 3,
  ).length;
  const stage4Count = allFlashcards.filter(
    (card) => (card.level ?? 0) === 4,
  ).length;
  const stage5Count = allFlashcards.filter(
    (card) => (card.level ?? 0) >= 5,
  ).length;
  const learnedCount = allFlashcards.filter(
    (card) => (card.level ?? 0) >= 1 || (card.learningStep ?? 0) >= 5,
  ).length;

  return {
    globalLearnedCount: overviewData?.totalLearnedWords ?? learnedCount,
    stages: [
      { level: 1, count: stage1Count },
      { level: 2, count: stage2Count },
      { level: 3, count: stage3Count },
      { level: 4, count: stage4Count },
      { level: 5, count: stage5Count },
    ],
  };
}
