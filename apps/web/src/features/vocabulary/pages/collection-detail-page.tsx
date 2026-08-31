'use client';

import { useVocabularyDecks } from '@/features/vocabulary/hooks';
import { RouteEnum } from '@/shared/constants';
import { formatUrl } from '@lumen/shared-api';
import {
  Button,
  Card,
  CardFooter,
  CardTitle,
  Input,
  Skeleton,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface CollectionDetailPageProps {
  collectionId: string;
}

export function CollectionDetailPage({
  collectionId,
}: CollectionDetailPageProps) {
  const router = useRouter();
  const { data, isLoading } = useVocabularyDecks();
  const [searchQuery, setSearchQuery] = useState('');

  const allDecks = data?.data || [];
  const systemDecks = allDecks.filter((d) => Boolean(d.category));

  // Filter topics by search query
  const filteredTopics = systemDecks.filter((topic) =>
    topic.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalWords = systemDecks.reduce(
    (acc, deck) => acc + (deck.flashcardCount || 0),
    0,
  );

  return (
    <div className="flex flex-col space-y-6 p-1 sm:p-2">
      {/* Back button & Header */}
      <div className="flex flex-col space-y-3">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 rounded-xl text-muted-foreground hover:text-foreground pl-0"
            onClick={() => router.push(RouteEnum.VOCABULARY)}
          >
            <Icons name="arrow-left" className="h-4 w-4" />
            Back to Collections
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              600 Essential Words for TOEIC
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {systemDecks.length > 0 ? systemDecks.length : 50} topics containing {totalWords > 0 ? totalWords : 608} vocabulary words.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Icons
              name="search"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            />
            <Input
              placeholder="Search topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-2xl bg-card border-border/60"
            />
          </div>
        </div>
      </div>

      {/* Grid of Topics */}
      <div className="flex flex-col space-y-4">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-2xl" />
            ))}
          </div>
        ) : filteredTopics.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground border border-dashed border-border/60 rounded-2xl">
            No topics found matching &quot;{searchQuery}&quot;.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTopics.map((topic) => (
              <Card
                key={topic.id}
                onClick={() =>
                  router.push(
                    formatUrl(RouteEnum.DECK_DETAIL, { id: topic.id }),
                  )
                }
                className="group relative flex flex-col justify-between border border-border/60 hover:border-primary/50 bg-card hover:shadow-md transition-all duration-200 cursor-pointer rounded-2xl p-4 overflow-hidden"
              >
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {topic.name}
                  </CardTitle>
                </div>

                <CardFooter className="p-0 pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Icons name="book-open" className="h-3.5 w-3.5 text-primary" />
                    {topic.flashcardCount} words
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
