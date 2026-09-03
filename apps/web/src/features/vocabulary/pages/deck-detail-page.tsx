'use client';

import Image from 'next/image';
import { useState } from 'react';

import { useVocabularyDeck } from '@/features/vocabulary/hooks';
import { RouteEnum } from '@/shared/constants';
import { useGoBack } from '@/shared/hooks';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { FlashcardStudyModal } from '../components/flashcard-study-modal';

interface DeckDetailPageProps {
  deckId: string;
}

export function DeckDetailPage({ deckId }: DeckDetailPageProps) {
  const goBack = useGoBack(RouteEnum.VOCABULARY);
  const { data: deckDetail, isLoading } = useVocabularyDeck(deckId);
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
        <p className="text-base font-semibold">Deck not found</p>
        <Button className="mt-4 rounded-xl" onClick={goBack}>
          Back to Vocabulary
        </Button>
      </div>
    );
  }

  const flashcards = deckDetail.flashcards || [];

  // Audio helper
  const playAudio = (url: string) => {
    try {
      const audio = new Audio(url);
      audio.play().catch(() => {});
    } catch {
      // Ignore audio playback errors
    }
  };

  // Convert flashcard to FlashcardItem for StudyModal
  const studyCards = flashcards.map((fc) => ({
    id: fc.id,
    term: fc.term,
    phonetic: fc.phonetic || undefined,
    audioUrl: fc.audioUrl || undefined,
    cefrLevel: fc.cefrLevel || undefined,
    definitions: fc.definitions?.map((d) => ({
      partOfSpeech: d.partOfSpeech,
      definitionEn: d.definition?.en || '',
      definitionVi: d.definition?.vi || '',
      examples: d.examples?.map((ex) => ({
        en: ex.sentence?.en || '',
        vi: ex.sentence?.vi || '',
      })),
    })),
  }));

  return (
    <div className="flex flex-col space-y-8 p-6 max-w-5xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground px-2.5 py-1 -ml-2.5 rounded-xl hover:bg-muted/60 transition-colors w-fit mb-2"
          >
            <Icons name="arrow-left" className="h-4 w-4" />
            <span>Back to Folders</span>
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black tracking-tight text-foreground">
              {deckDetail.name}
            </h1>
            {deckDetail.category && (
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20">
                {deckDetail.category}
              </span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <Button
            className="rounded-xl font-bold shadow-sm flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={flashcards.length === 0}
            onClick={() => setIsStudyModalOpen(true)}
          >
            <Icons name="play" className="h-4 w-4 fill-current" />
            <span>Study Folder</span>
          </Button>
        </div>
      </div>

      {/* Word List Section */}
      <Card className="rounded-3xl border border-border/60 shadow-xs overflow-hidden">
        <CardHeader className="bg-muted/30 border-b border-border/40 py-4 px-6 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <span>Vocabulary Words</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          {flashcards.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              This deck has no words yet.
            </div>
          ) : (
            <div className="space-y-3">
              {flashcards.map((fc) => {
                const primaryDef = fc.definitions?.[0];
                const meaningVi = primaryDef?.definition?.vi || '';
                const explainEn = primaryDef?.definition?.en || '';
                const examples = primaryDef?.examples || [];

                return (
                  <div
                    key={fc.id}
                    className="rounded-2xl border border-border/60 bg-card p-5 hover:border-primary/40 hover:shadow-sm transition-all flex flex-col sm:flex-row items-start justify-between gap-5"
                  >
                    {/* Left: Term info & details */}
                    <div className="flex-1 min-w-0">
                      {/* Term row */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base font-black uppercase tracking-wide text-foreground">
                          {fc.term}
                        </span>
                        {primaryDef?.partOfSpeech && (
                          <span className="text-sm text-muted-foreground font-medium">
                            ({primaryDef.partOfSpeech})
                          </span>
                        )}
                        {fc.phonetic && (
                          <span className="text-sm text-muted-foreground font-mono">
                            {fc.phonetic}
                          </span>
                        )}
                        {fc.audioUrl && (
                          <button
                            type="button"
                            onClick={() => playAudio(fc.audioUrl)}
                            className="ml-0.5 p-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                            title="Listen"
                          >
                            <Icons name="volume-2" className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Definition */}
                      {(explainEn || meaningVi) && (
                        <div className="mt-2.5 text-sm">
                          <span className="font-semibold text-foreground">Định nghĩa: </span>
                          <span className="text-muted-foreground">
                            {[explainEn, meaningVi].filter(Boolean).join('. ')}
                          </span>
                        </div>
                      )}

                      {/* Examples */}
                      {examples.length > 0 && (
                        <div className="mt-2 text-sm">
                          <span className="font-semibold text-foreground">Ví dụ:</span>
                          <ul className="mt-1 space-y-1 list-disc list-inside">
                            {examples.map((ex) => (
                              <li key={ex.id} className="text-muted-foreground leading-relaxed">
                                {ex.sentence?.en && (
                                  <span className="text-foreground">{ex.sentence.en}</span>
                                )}
                                {ex.sentence?.vi && (
                                  <span className="block ml-5 text-muted-foreground text-xs mt-0.5">
                                    {ex.sentence.vi}
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Right: Word Image */}
                    {fc.imageUrl && (
                      <div className="relative shrink-0 self-center sm:self-start w-full sm:w-36 h-28 sm:h-28 rounded-xl overflow-hidden border border-border/60 bg-muted/40 shadow-xs">
                        <Image
                          src={fc.imageUrl}
                          alt={fc.term}
                          fill
                          sizes="(max-width: 640px) 100vw, 144px"
                          className="object-cover transition-transform duration-300 hover:scale-105"
                          unoptimized
                        />
                      </div>
                    )}
                  </div>
                );
              })}
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
    </div>
  );
}
