'use client';

import { CreateDeckDialog } from '@/features/vocabulary/components/create-deck-dialog';
import {
  useDueFlashcards,
  useVocabularyDecks,
} from '@/features/vocabulary/hooks';
import {
  Button,
  Card,
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
import { formatUrl } from '@lumen/shared-api';

export function DeckListPage() {
  const t = useTranslations('Vocabulary.Decks');

  const { data, isLoading } = useVocabularyDecks();
  const { data: dueFlashcards } = useDueFlashcards();
  const [presentCreateDeck] = usePortal(CreateDeckDialog);
  const router = useRouter();

  const allDecks = data?.data || [];
  const systemDecks = allDecks.filter((d) => Boolean(d.category));
  const customDecks = allDecks.filter((d) => !d.category);
  const decksToDisplay = systemDecks.length > 0 ? systemDecks : allDecks;

  return (
    <div className="flex flex-col space-y-6 p-1 sm:p-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t('title') || 'Vocabulary Decks'}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Choose a topic or deck to start studying.
          </p>
        </div>
        <Button className="gap-2 rounded-xl" onClick={() => presentCreateDeck()}>
          <Icons name="plus" className="h-4 w-4" />
          {t('createDeck')}
        </Button>
      </div>

      {/* Main Decks Grid */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icons name="book-open" className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold tracking-tight text-foreground">
              Topics
            </h3>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">
              {decksToDisplay.length}
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-2xl" />
            ))}
          </div>
        ) : decksToDisplay.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-border/70 rounded-2xl bg-muted/20">
            <Icons
              name="book-open"
              className="h-9 w-9 mb-2 text-muted-foreground/50"
            />
            <p className="text-sm font-medium text-muted-foreground mb-3">
              {t('noDecks')}
            </p>
            <Button
              size="sm"
              className="gap-2 rounded-xl"
              onClick={() => presentCreateDeck()}
            >
              <Icons name="plus" className="h-4 w-4" />
              {t('createDeck')}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {decksToDisplay.map((deck) => (
              <Card
                key={deck.id}
                onClick={() =>
                  router.push(formatUrl(RouteEnum.DECK_DETAIL, { id: deck.id }))
                }
                className="group relative flex flex-col justify-between border border-border/60 hover:border-primary/50 bg-card hover:shadow-md transition-all duration-200 cursor-pointer rounded-2xl overflow-hidden"
              >
                <CardHeader className="space-y-1.5 pb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
                      {deck.category || 'Deck'}
                    </span>
                    <Icons
                      name="arrow-right"
                      className="h-4 w-4 text-muted-foreground/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all"
                    />
                  </div>
                  <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {deck.name}
                  </CardTitle>
                  {deck.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {deck.description}
                    </p>
                  )}
                </CardHeader>
                <CardFooter className="border-t border-border/40 bg-muted/20 pt-2.5 pb-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                    <Icons name="book-open" className="h-3.5 w-3.5 text-primary" />
                    {deck.flashcardCount} words
                  </div>
                  <span className="text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Study &rarr;
                  </span>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* My Decks Section (if custom decks exist) */}
      {customDecks.length > 0 && systemDecks.length > 0 && (
        <div className="flex flex-col space-y-4 pt-4">
          <div className="flex items-center gap-2">
            <Icons name="folder" className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold tracking-tight text-foreground">
              My Decks
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {customDecks.map((deck) => {
              const dueCountForDeck =
                dueFlashcards?.data.filter((df) => df.deckId === deck.id)
                  .length || 0;
              return (
                <Card
                  key={deck.id}
                  onClick={() =>
                    router.push(formatUrl(RouteEnum.DECK_DETAIL, { id: deck.id }))
                  }
                  className="group relative flex flex-col justify-between border border-border/60 hover:border-primary/50 bg-card hover:shadow-md transition-all duration-200 cursor-pointer rounded-2xl overflow-hidden"
                >
                  <CardHeader className="space-y-1.5 pb-3">
                    <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      {deck.name}
                    </CardTitle>
                    {deck.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {deck.description}
                      </p>
                    )}
                  </CardHeader>
                  <CardFooter className="border-t border-border/40 bg-muted/20 pt-2.5 pb-2.5 flex justify-between items-center">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Icons name="clock" className="mr-1 h-3.5 w-3.5" />
                      Due: {dueCountForDeck}
                    </div>
                    <span className="text-xs font-semibold text-primary">
                      {t('studyNow')}
                    </span>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
