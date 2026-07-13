'use client';

import { CreateDeckDialog } from '@/features/vocabulary/components/create-deck-dialog';
import {
  useDueFlashcards,
  useVocabularyDecks,
} from '@/features/vocabulary/hooks';
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Skeleton,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { usePortal } from '@lumen/uikit/portal';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { RouteEnum } from '@/shared/constants';
import { formatUrl } from '@/shared/utils';

export function DeckListPage() {
  const t = useTranslations('Vocabulary.Decks');

  const { data, isLoading } = useVocabularyDecks();
  const { data: dueFlashcards } = useDueFlashcards();
  const [presentCreateDeck] = usePortal(CreateDeckDialog);
  const router = useRouter();

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col space-y-6 overflow-y-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
          <p className="text-muted-foreground">{t('description')}</p>
        </div>
        <Button className="gap-2" onClick={() => presentCreateDeck()}>
          <Icons name="plus" className="h-4 w-4" />
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
            <Icons
              name="book-open"
              className="mx-auto h-10 w-10 mb-4 opacity-50"
            />
            <p>{t('noDecks')}</p>
          </div>
        ) : (
          data?.data.map((deck, index) => {
            const dueCountForDeck =
              dueFlashcards?.data.filter((df) => df.deckId === deck.id)
                .length || 0;
            return (
              <Card
                key={deck.id || index}
                onClick={() =>
                  router.push(formatUrl(RouteEnum.DECK_DETAIL, { id: deck.id }))
                }
                className="group relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg hover:border-primary/50 cursor-pointer"
              >
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
                    <Icons name="book-open" className="h-4 w-4 text-primary" />
                    {deck.flashcardCount} {t('cards')}
                  </div>
                </CardContent>
                <CardFooter className="relative border-t border-border/50 bg-muted/20 mt-auto pt-4 flex justify-between items-center">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Icons name="clock" className="mr-1 h-3 w-3" />
                    {t('dueToday')}: {dueCountForDeck}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="group-hover:text-primary"
                  >
                    {t('studyNow')}
                  </Button>
                </CardFooter>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
