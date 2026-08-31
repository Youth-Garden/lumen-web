'use client';

import { CreateDeckDialog } from '@/features/vocabulary/components/create-deck-dialog';
import {
  useDueFlashcards,
  useVocabularyDecks,
} from '@/features/vocabulary/hooks';
import { SYSTEM_DECKS } from '@/features/vocabulary/constants/system-decks';
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
import { formatUrl } from '@lumen/shared-api';

export function DeckListPage() {
  const t = useTranslations('Vocabulary.Decks');

  const { data, isLoading } = useVocabularyDecks();
  const { data: dueFlashcards } = useDueFlashcards();
  const [presentCreateDeck] = usePortal(CreateDeckDialog);
  const router = useRouter();

  return (
    <div className="flex flex-col space-y-8 p-1 sm:p-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-heading font-bold tracking-tight text-foreground">
            {t('title')}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Explore curated system decks or build your own custom flashcards.
          </p>
        </div>
        <Button className="gap-2 rounded-xl" onClick={() => presentCreateDeck()}>
          <Icons name="plus" className="h-4 w-4" />
          {t('createDeck')}
        </Button>
      </div>

      {/* 1. System Decks Section */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center gap-2">
          <Icons name="sparkles" className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold tracking-tight text-foreground">
            System Decks
          </h3>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border border-primary/30 bg-primary/10 text-primary">
            Pre-built
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SYSTEM_DECKS.map((sysDeck) => (
            <Card
              key={sysDeck.id}
              onClick={() => router.push(RouteEnum.FLASHCARD_REVIEW)}
              className="group relative flex flex-col justify-between border border-border/60 hover:border-primary/50 bg-card hover:shadow-md transition-all duration-300 cursor-pointer rounded-2xl overflow-hidden"
            >
              <CardHeader className="space-y-2 pb-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${sysDeck.badgeColor}`}>
                    {sysDeck.category}
                  </span>
                  <Icons name={sysDeck.iconName as any} className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  {sysDeck.name}
                </CardTitle>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {sysDeck.description}
                </p>
              </CardHeader>
              <CardFooter className="border-t border-border/40 bg-muted/20 pt-3 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <Icons name="book-open" className="h-3.5 w-3.5 text-primary" />
                  {sysDeck.cardCount} words
                </div>
                <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold text-primary hover:bg-primary/10">
                  Study Now &rarr;
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* 2. My Custom Decks Section */}
      <div className="flex flex-col space-y-4 pt-2">
        <div className="flex items-center gap-2">
          <Icons name="folder" className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold tracking-tight text-foreground">
            My Custom Decks
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-44 w-full rounded-2xl" />
            ))
          ) : data?.data.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-border/70 rounded-2xl bg-muted/20">
              <Icons name="book-open" className="h-10 w-10 mb-3 text-muted-foreground/50" />
              <p className="text-sm font-medium text-muted-foreground mb-3">{t('noDecks')}</p>
              <Button size="sm" className="gap-2 rounded-xl" onClick={() => presentCreateDeck()}>
                <Icons name="plus" className="h-4 w-4" />
                {t('createDeck')}
              </Button>
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
                  className="group relative flex flex-col justify-between border border-border/60 hover:border-primary/50 bg-card hover:shadow-md transition-all duration-300 cursor-pointer rounded-2xl overflow-hidden"
                >
                  <CardHeader className="space-y-2 pb-3">
                    <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      {deck.name}
                    </CardTitle>
                    {deck.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {deck.description}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                      <Icons name="book-open" className="h-4 w-4 text-primary" />
                      {deck.flashcardCount} {t('cards')}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t border-border/40 bg-muted/20 pt-3 pb-3 flex justify-between items-center">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Icons name="clock" className="mr-1 h-3.5 w-3.5" />
                      {t('dueToday')}: {dueCountForDeck}
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold group-hover:text-primary">
                      {t('studyNow')}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
