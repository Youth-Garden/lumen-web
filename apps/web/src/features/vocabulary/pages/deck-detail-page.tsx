'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import {
  useDueFlashcards,
  useVocabularyDeck,
} from '@/features/vocabulary/hooks';
import { RouteEnum } from '@/shared/constants';
import { CefrLevelEnum } from '@/shared/types';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { StudySettingsDialog } from '../components/study-settings-dialog';
import { FlashcardStudyModal } from '../components/flashcard-study-modal';

interface DeckDetailPageProps {
  deckId: string;
}

export function DeckDetailPage({ deckId }: DeckDetailPageProps) {
  const t = useTranslations('Vocabulary.DeckDetail');
  const router = useRouter();

  const { data: deckDetail, isLoading } = useVocabularyDeck(deckId);
  const { data: dueFlashcards } = useDueFlashcards({ deckId });

  const [isStudySettingsOpen, setIsStudySettingsOpen] = useState(false);
  const [isStudyModalOpen, setIsStudyModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-6 p-6">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-64 w-full mt-8" />
      </div>
    );
  }

  if (!deckDetail) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] w-full text-destructive">
        <Icons name="danger" className="h-10 w-10 mb-4" />
        <p>{t('notFound') || 'Deck not found'}</p>
        <Button
          className="mt-4"
          onClick={() => router.push(RouteEnum.VOCABULARY)}
        >
          {t('backToDecks') || 'Back to Decks'}
        </Button>
      </div>
    );
  }

  const dueCount = dueFlashcards?.data.length || 0;
  const flashcards = deckDetail.flashcards || [];

  const studyCards = (dueFlashcards?.data || []).map((fc) => ({
    id: fc.flashcardId,
    word: {
      id: fc.wordId,
      term: fc.term,
      phonetic: '',
      audioUrl: '',
      cefrLevel: '',
      definitions: [],
    },
  }));

  const getCefrColor = (level?: string | null) => {
    if (!level) return 'bg-secondary text-secondary-foreground';
    switch (level.toUpperCase()) {
      case CefrLevelEnum.A1:
      case CefrLevelEnum.A2:
        return 'bg-green-500/10 text-green-500';
      case CefrLevelEnum.B1:
      case CefrLevelEnum.B2:
        return 'bg-blue-500/10 text-blue-500';
      case CefrLevelEnum.C1:
      case CefrLevelEnum.C2:
        return 'bg-purple-500/10 text-purple-500';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="flex flex-col space-y-6 h-full min-h-[calc(100vh-8rem)]">
      <div className="flex items-center gap-4 mb-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(RouteEnum.VOCABULARY)}
        >
          <Icons name="arrow-left" className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-3xl font-bold tracking-tight">
            {deckDetail.name}
          </h2>
          {deckDetail.description && (
            <p className="text-muted-foreground mt-1">
              {deckDetail.description}
            </p>
          )}
        </div>
        <Button
          onClick={() => setIsStudyModalOpen(true)}
          className="gap-2 shrink-0 rounded-full px-6 shadow-md"
          disabled={studyCards.length === 0}
        >
          <Icons name="play" className="h-4 w-4" />
          {t('learn') || 'Learn Flashcards'} ({studyCards.length})
        </Button>
      </div>

      <Card className="flex-1">
        <CardHeader className="bg-muted/30 border-b pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Icons name="book-open" className="h-5 w-5 text-primary" />
            {flashcards.length} {t('words') || 'Words'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {flashcards.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              {t('emptyDeck') || 'This deck has no words yet.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/20">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-medium">
                      Term
                    </th>
                    <th scope="col" className="px-6 py-4 font-medium">
                      Level
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {flashcards.map((fc) => (
                    <tr
                      key={fc.id}
                      className="hover:bg-muted/10 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-foreground">
                        {fc.term}
                      </td>
                      <td className="px-6 py-4">
                        {fc.cefrLevel && (
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getCefrColor(
                              fc.cefrLevel,
                            )}`}
                          >
                            {fc.cefrLevel}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <FlashcardStudyModal
        cards={studyCards}
        isOpen={isStudyModalOpen}
        onClose={() => setIsStudyModalOpen(false)}
        deckName={deckDetail.name}
      />

      <StudySettingsDialog
        isOpen={isStudySettingsOpen}
        onClose={() => setIsStudySettingsOpen(false)}
        deckId={deckId}
        totalCards={dueCount}
      />
    </div>
  );
}
