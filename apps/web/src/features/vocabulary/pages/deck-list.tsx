'use client';

import { useVocabularyDecksQuery } from '@/features/vocabulary/hooks/queries';
import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle, Skeleton } from '@lumen/uikit/components';
import { Plus, BookOpen, Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { CreateDeckDialog } from '@/features/vocabulary/components/create-deck-dialog';
import { usePortal } from '@lumen/uikit/portal';

export function DeckList() {
  const t = useTranslations('Vocabulary.Decks');

  const { data, isLoading } = useVocabularyDecksQuery();
  const [presentCreateDeck] = usePortal(CreateDeckDialog);

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
          <p className="text-muted-foreground">{t('description')}</p>
        </div>
        <Button className="gap-2" onClick={() => presentCreateDeck()}>
          <Plus className="h-4 w-4" />
          {t('createDeck')}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))
        ) : data?.data.length === 0 ? (
          <div className="col-span-full text-center py-20 text-muted-foreground border-2 border-dashed border-border rounded-xl">
            <BookOpen className="mx-auto h-10 w-10 mb-4 opacity-50" />
            <p>{t('noDecks')}</p>
          </div>
        ) : (
          data?.data.map((deck) => (
            <Card key={deck.id} className="group relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg hover:border-primary/50 cursor-pointer">
              {/* Glassmorphism gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardHeader className="relative">
                <CardTitle className="text-xl">{deck.name}</CardTitle>
                {deck.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                    {deck.description}
                  </p>
                )}
              </CardHeader>
              <CardContent className="relative">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <BookOpen className="h-4 w-4 text-primary" />
                  {deck.flashcardCount} {t('cards')}
                </div>
              </CardContent>
              <CardFooter className="relative border-t border-border/50 bg-muted/20 mt-auto pt-4 flex justify-between items-center">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="mr-1 h-3 w-3" />
                  {t('dueToday')}: 0
                </div>
                <Button variant="ghost" size="sm" className="group-hover:text-primary">
                  {t('studyNow')}
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
