'use client';

import { useState } from 'react';
import { useVocabularyWords } from '@/features/vocabulary/hooks';
import {
  Input,
  Button,
  Card,
  CardContent,
  ScrollArea,
  Skeleton,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { useTranslations } from 'next-intl';
import { AddFlashcardDialog } from '@/features/vocabulary/components/add-flashcard-dialog';
import { usePortal } from '@lumen/uikit/portal';
import { useDebounce } from '@lumen/hooks';

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

  const playAudio = (url: string) => {
    const audio = new Audio(url);
    audio.play();
  };

  const getCefrColor = (level: string) => {
    switch (level.toUpperCase()) {
      case 'A1':
      case 'A2':
        return 'bg-green-500/10 text-green-500';
      case 'B1':
      case 'B2':
        return 'bg-blue-500/10 text-blue-500';
      case 'C1':
      case 'C2':
        return 'bg-purple-500/10 text-purple-500';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
          <p className="text-muted-foreground">{t('description')}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Icons
            name="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
          />
          <Input
            placeholder={t('searchPlaceholder')}
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Icons name="filter" className="h-4 w-4" />
          {t('filterByLevel')}
        </Button>
      </div>

      <ScrollArea className="flex-1 rounded-md border border-border">
        <div className="p-4 grid gap-4">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))
          ) : data?.data.items.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              {t('noResults')}
            </div>
          ) : (
            data?.data.items.map((word, index) => (
              <Card
                key={word.id || `word-${index}`}
                className="group overflow-hidden transition-all hover:border-primary/50"
              >
                <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-gradient-to-r from-card to-card/50">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-foreground">
                        {word.term}
                      </h3>
                      {word.cefrLevel && (
                        <div
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getCefrColor(word.cefrLevel)}`}
                        >
                          {word.cefrLevel}
                        </div>
                      )}
                      {word.audioUrl && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary rounded-full"
                          onClick={() => playAudio(word.audioUrl!)}
                        >
                          <Icons name="volume-2" className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    {word.phonetic && (
                      <p className="text-sm text-muted-foreground font-mono mb-2">
                        /{word.phonetic}/
                      </p>
                    )}
                    <div className="space-y-1">
                      {(word.definitions || []).slice(0, 2).map((def, defIndex) => (
                        <div key={def.id || `def-${defIndex}`} className="text-sm">
                          <span className="italic text-muted-foreground mr-2">
                            {def.partOfSpeech}.
                          </span>
                          <span className="text-foreground">
                            {def.definitionEn}
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
                        {t('addToDeck')}
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
