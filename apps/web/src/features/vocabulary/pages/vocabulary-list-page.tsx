'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { useDebounce } from '@lumen/hooks';
import {
  Button,
  Card,
  CardContent,
  Input,
  ScrollArea,
  Skeleton,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { usePortal } from '@lumen/uikit/portal';

import { AddFlashcardDialog } from '@/features/vocabulary/components/dialogs/add-flashcard-dialog';
import { useVocabularyWords } from '@/features/vocabulary/hooks';
import { HighlightText } from '@/shared/components/highlight-text';
import { AudioButton } from '@/shared/components/audio-button';
import { CefrLevelEnum } from '@/shared/types';

export function VocabularyListPage() {
  const t = useTranslations('Vocabulary.List');
  const [search, setSearch] = useState('');
  const [cefrLevel, setCefrLevel] = useState<string>('');
  const debouncedSearch = useDebounce(search, 500);

  const [presentAddFlashcard] = usePortal(AddFlashcardDialog);

  const { data, isLoading } = useVocabularyWords({
    search: debouncedSearch,
    cefrLevel,
  });

  const getCefrColor = (level: string) => {
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
          <p className="text-muted-foreground">{t('description')}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="relative w-full max-w-md">
          <Icons
            name="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
          />
          <Input
            placeholder={t('searchPlaceholder')}
            className="pl-9"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground mr-2 font-medium">
            CEFR Level:
          </span>
          <Button
            variant={cefrLevel === '' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCefrLevel('')}
          >
            All
          </Button>
          {Object.values(CefrLevelEnum).map((level) => (
            <Button
              key={level}
              variant={cefrLevel === level ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCefrLevel(level)}
            >
              {level}
            </Button>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1 rounded-md border border-border">
        <div className="p-4 grid gap-4">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, skeletonIndex) => (
              <Skeleton
                key={skeletonIndex}
                className="h-24 w-full rounded-xl"
              />
            ))
          ) : data?.items.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              {t('noResults')}
            </div>
          ) : (
            data?.items.map((word, index) => (
              <Card
                key={word.id || `word-${index}`}
                className="group overflow-hidden transition-all hover:border-primary/50"
              >
                <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-gradient-to-r from-card to-card/50">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-foreground">
                        <HighlightText
                          text={word.term}
                          query={debouncedSearch}
                        />
                      </h3>
                      {word.cefrLevel && (
                        <div
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getCefrColor(word.cefrLevel)}`}
                        >
                          {word.cefrLevel}
                        </div>
                      )}
                      {word.audioUrl && (
                        <AudioButton
                          url={word.audioUrl}
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                          iconClassName="h-4 w-4"
                        />
                      )}
                    </div>
                    {word.phonetic && (
                      <p className="text-sm text-muted-foreground font-mono mb-2">
                        /{word.phonetic}/
                      </p>
                    )}
                    <div className="space-y-1">
                      {(word.definitions || [])
                        .slice(0, 2)
                        .map((def, defIndex) => (
                          <div
                            key={def.id || `def-${defIndex}`}
                            className="text-sm"
                          >
                            <span className="italic text-muted-foreground mr-2">
                              {def.partOfSpeech}.
                            </span>
                            <span className="text-foreground">
                              <HighlightText
                                text={def.definitionEn}
                                query={debouncedSearch}
                              />
                            </span>
                            <span className="text-muted-foreground ml-2">
                              ({def.translationVi})
                            </span>
                          </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() =>
                          presentAddFlashcard({
                            wordId: word.id,
                            term: word.term,
                          })
                        }
                      >
                        <Icons name="plus" className="h-4 w-4" />
                        {t('addToFolder')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
