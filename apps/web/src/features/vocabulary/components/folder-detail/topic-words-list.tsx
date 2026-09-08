'use client';

import { useTranslations } from 'next-intl';

import Image from 'next/image';
import { Icons } from '@lumen/uikit/icons';
import { Button } from '@lumen/uikit/components';
import {
  PronunciationAccent,
  type VocabularyWord,
} from '@/services/vocabulary';

export interface TopicWordsListProps {
  topicName: string;
  topicViName?: string;
  flashcards: VocabularyWord[];
  onBackToTopics: () => void;
  onPlayAudio: (payload: {
    term: string;
    audioUrl?: string;
    audioUsUrl?: string;
    audioUkUrl?: string;
    accent: PronunciationAccent;
  }) => void;
}

export function TopicWordsList({
  topicName,
  topicViName,
  flashcards,
  onBackToTopics,
  onPlayAudio,
}: TopicWordsListProps) {
  const t = useTranslations('Vocabulary.Folders');
  return (
    <div className="space-y-6">
      {/* Header with Back to Topics button */}
      <div className="flex flex-col gap-4 border-b border-border/60 pb-4">
        <button
          type="button"
          onClick={onBackToTopics}
          className="flex items-center gap-1.5 -ml-2.5 px-2.5 py-1 text-sm font-medium w-fit text-muted-foreground hover:text-foreground cursor-pointer rounded-lg hover:bg-muted/60 transition-colors"
        >
          <Icons name="arrow-left" className="h-4 w-4" />
          <span>{t('backToTopics')}</span>
        </button>

        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            {topicViName || topicName}
          </h1>
          <span className="text-sm font-semibold text-muted-foreground">
            ({topicName})
          </span>
          <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-primary/10 text-primary">
            {t('wordsCount', { count: flashcards.length })}
          </span>
        </div>
      </div>

      {/* Word List */}
      <div className="space-y-3">
        {flashcards.map((flashcard) => {
          const primaryDefinition = flashcard.definitions?.[0];
          const meaningVi = primaryDefinition?.definition?.vi || '';
          const explainEn = primaryDefinition?.definition?.en || '';
          const examples = primaryDefinition?.examples || [];

          return (
            <div
              key={flashcard.id}
              className="rounded-2xl bg-card p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start justify-between gap-5 border border-border/40"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-base font-black uppercase tracking-wide text-foreground">
                    {flashcard.term}
                  </span>
                  {primaryDefinition?.partOfSpeech && (
                    <span className="text-sm text-muted-foreground font-medium">
                      ({primaryDefinition.partOfSpeech})
                    </span>
                  )}
                  {flashcard.phonetic && (
                    <span className="text-sm text-muted-foreground font-mono">
                      {flashcard.phonetic}
                    </span>
                  )}

                  {/* US Audio Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 gap-1 text-xs font-semibold cursor-pointer text-muted-foreground hover:text-foreground"
                    onClick={() =>
                      onPlayAudio({
                        term: flashcard.term,
                        audioUrl: flashcard.audioUrl || undefined,
                        audioUsUrl: flashcard.audioUsUrl || undefined,
                        accent: PronunciationAccent.US,
                      })
                    }
                    title={t('listenUs')}
                  >
                    <Icons name="volume-2" className="h-3 w-3 text-primary" />
                    <span>US</span>
                  </Button>

                  {/* UK Audio Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 gap-1 text-xs font-semibold cursor-pointer text-muted-foreground hover:text-foreground"
                    onClick={() =>
                      onPlayAudio({
                        term: flashcard.term,
                        audioUkUrl: flashcard.audioUkUrl || undefined,
                        accent: PronunciationAccent.UK,
                      })
                    }
                    title={t('listenUk')}
                  >
                    <Icons name="volume-2" className="h-3 w-3 text-sky-500" />
                    <span>UK</span>
                  </Button>
                </div>

                {meaningVi && (
                  <p className="text-sm font-semibold text-primary mt-1.5">
                    {meaningVi}
                  </p>
                )}

                {explainEn && (
                  <p className="text-xs text-muted-foreground mt-0.5 italic">
                    {explainEn}
                  </p>
                )}

                {examples.length > 0 && (
                  <div className="mt-3 space-y-1.5 pl-3 border-l-2 border-primary/30 text-xs">
                    {examples.slice(0, 2).map((example, exampleIdx) => (
                      <div key={exampleIdx} className="space-y-0.5">
                        <p className="text-foreground font-medium">
                          • {example.sentenceEn || example.sentence?.en}
                        </p>
                        {(example.translationVi || example.sentence?.vi) && (
                          <p className="text-muted-foreground">
                            {example.translationVi || example.sentence?.vi}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {flashcard.imageUrl && (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden relative shadow-inner bg-muted/40 shrink-0 border border-border/40">
                  <Image
                    src={flashcard.imageUrl}
                    alt={flashcard.term}
                    fill
                    sizes="96px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
