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

  const studyCards = flashcards.map((fc) => ({
    id: fc.id,
    word: {
      id: fc.wordId,
      term: fc.term,
      phonetic: fc.phonetic || '',
      audioUrl: fc.audioUrl || '',
      cefrLevel: fc.cefrLevel || '',
      definitions: (fc.definitions || []).map((def) => ({
        id: def.id,
        partOfSpeech: def.partOfSpeech,
        definition: def.definition,
        examples: def.examples || [],
      })),
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

  const playAudio = (audioUrl?: string | null) => {
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    audio.play().catch(() => {});
  };

  return (
    <div className="flex flex-col space-y-6 h-full min-h-[calc(100vh-8rem)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl"
            onClick={() => router.push(RouteEnum.VOCABULARY)}
          >
            <Icons name="arrow-left" className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {deckDetail.name}
              </h2>
              {deckDetail.category && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border border-primary/30 bg-primary/10 text-primary uppercase tracking-wider">
                  {deckDetail.category}
                </span>
              )}
            </div>
            {deckDetail.description && (
              <p className="text-sm text-muted-foreground mt-0.5">
                {deckDetail.description}
              </p>
            )}
          </div>
        </div>
        <Button
          onClick={() => setIsStudyModalOpen(true)}
          className="gap-2 shrink-0 rounded-xl px-6 shadow-md"
          disabled={studyCards.length === 0}
        >
          <Icons name="play" className="h-4 w-4" />
          {t('learn') || 'Study Flashcards'} ({studyCards.length})
        </Button>
      </div>

      <Card className="flex-1 rounded-2xl border-border/60 overflow-hidden shadow-sm">
        <CardHeader className="bg-muted/30 border-b border-border/60 pb-4">
          <CardTitle className="text-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icons name="book-open" className="h-5 w-5 text-primary" />
              {flashcards.length} {t('words') || 'Words'}
            </div>
            <span className="text-xs font-normal text-muted-foreground">
              Click word or audio icon to listen
            </span>
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
                <thead className="text-xs text-muted-foreground uppercase bg-muted/20 border-b border-border/40">
                  <tr>
                    <th scope="col" className="px-6 py-3.5 font-semibold">
                      Term / Phonetic
                    </th>
                    <th scope="col" className="px-6 py-3.5 font-semibold">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3.5 font-semibold">
                      Meaning (VI)
                    </th>
                    <th scope="col" className="px-6 py-3.5 font-semibold">
                      Explanation (EN)
                    </th>
                    <th scope="col" className="px-6 py-3.5 font-semibold">
                      Example Sentence
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {flashcards.map((fc) => {
                    const primaryDef = fc.definitions?.[0];
                    const primaryExample = primaryDef?.examples?.[0];
                    const meaningVi = primaryDef?.definition?.vi || '—';
                    const explainEn = primaryDef?.definition?.en || '—';
                    const exampleEn = primaryExample?.sentence?.en || '';
                    const exampleVi = primaryExample?.sentence?.vi || '';

                    return (
                      <tr
                        key={fc.id}
                        className="hover:bg-muted/15 transition-colors group"
                      >
                        <td className="px-6 py-4 font-semibold text-foreground">
                          <div className="flex items-center gap-2">
                            <span>{fc.term}</span>
                            {fc.audioUrl && (
                              <button
                                type="button"
                                onClick={() => playAudio(fc.audioUrl)}
                                className="text-muted-foreground hover:text-primary transition-colors p-1 rounded-md"
                                title="Listen pronunciation"
                              >
                                <Icons name="volume-2" className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                          {fc.phonetic && (
                            <span className="text-xs text-muted-foreground font-mono block mt-0.5">
                              {fc.phonetic}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {primaryDef?.partOfSpeech && (
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/50">
                              {primaryDef.partOfSpeech}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-foreground font-medium max-w-xs">
                          {meaningVi}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground text-xs leading-relaxed max-w-xs">
                          {explainEn}
                        </td>
                        <td className="px-6 py-4 text-xs max-w-sm">
                          {exampleEn ? (
                            <div className="space-y-1">
                              <p className="text-foreground italic">
                                &quot;{exampleEn}&quot;
                              </p>
                              {exampleVi && (
                                <p className="text-muted-foreground">
                                  {exampleVi}
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
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
