'use client';

import { CreateDeckDialog } from '@/features/vocabulary/components/create-deck-dialog';
import {
  useDueFlashcards,
  useVocabularyDecks,
} from '@/features/vocabulary/hooks';
import {
  Button,
  Card,
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
  const customFolders = allDecks.filter((d) => !d.category);

  // Calculate TOEIC total words
  const toeicTotalWords = systemDecks.reduce(
    (acc, deck) => acc + (deck.flashcardCount || 0),
    0,
  );

  return (
    <div className="flex flex-col space-y-8 p-1 sm:p-2">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl font-heading">
            {t('title') || 'Vocabulary'}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Organize your learning with folders and flashcards.
          </p>
        </div>
        <Button className="gap-2 rounded-xl shadow-sm" onClick={() => presentCreateDeck()}>
          <Icons name="plus" className="h-4 w-4" />
          Create Folder
        </Button>
      </div>

      {/* 1. Main System Folders */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center gap-2">
          <Icons name="folder" className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold tracking-tight text-foreground">
            Folders
          </h3>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <Skeleton className="h-28 w-full rounded-2xl" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* TOEIC 600 Words Main Folder Card */}
            <Card
              onClick={() =>
                router.push(
                  formatUrl(RouteEnum.COLLECTION_DETAIL, { id: 'toeic' }),
                )
              }
              className="group relative flex flex-col justify-between border border-border/80 hover:border-primary/60 bg-card hover:shadow-md transition-all duration-200 cursor-pointer rounded-2xl p-5 overflow-hidden"
            >
              <div className="space-y-1">
                <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  600 Essential Words for TOEIC
                </h4>
                <p className="text-xs text-muted-foreground font-medium">
                  {systemDecks.length > 0 ? systemDecks.length : 50} Topics &bull; {toeicTotalWords > 0 ? toeicTotalWords : 608} Words
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end">
                <span className="text-xs font-bold text-primary flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Open Folder &rarr;
                </span>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* 2. My Folders Section */}
      <div className="flex flex-col space-y-4 pt-2">
        <div className="flex items-center gap-2">
          <Icons name="folder" className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold tracking-tight text-foreground">
            My Folders
          </h3>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-36 w-full rounded-2xl" />
            ))}
          </div>
        ) : customFolders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-6 text-center border-2 border-dashed border-border/60 rounded-2xl bg-transparent transition-colors">
            <div className="p-3.5 rounded-full bg-primary/10 text-primary mb-3">
              <Icons name="folder" className="h-7 w-7" />
            </div>
            <p className="text-sm font-bold text-foreground">
              No custom folders yet
            </p>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              Create your own folders to organize and study custom flashcards.
            </p>
            <Button
              size="sm"
              className="gap-2 rounded-xl mt-4 shadow-sm"
              onClick={() => presentCreateDeck()}
            >
              <Icons name="plus" className="h-4 w-4" />
              Create Folder
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {customFolders.map((folder) => {
              const dueCountForFolder =
                dueFlashcards?.data.filter((df) => df.deckId === folder.id)
                  .length || 0;
              return (
                <Card
                  key={folder.id}
                  onClick={() =>
                    router.push(formatUrl(RouteEnum.DECK_DETAIL, { id: folder.id }))
                  }
                  className="group relative flex flex-col justify-between border border-border/60 hover:border-primary/50 bg-card hover:shadow-md transition-all duration-200 cursor-pointer rounded-2xl p-4"
                >
                  <div className="space-y-1">
                    <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      {folder.name}
                    </CardTitle>
                    {folder.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {folder.description}
                      </p>
                    )}
                  </div>
                  <div className="pt-3 mt-3 border-t border-border/40 flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">
                      Due: {dueCountForFolder}
                    </span>
                    <span className="font-semibold text-primary">
                      Study &rarr;
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
