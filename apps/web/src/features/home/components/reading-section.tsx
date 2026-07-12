'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Icons } from '@lumen/uikit/icons';
import { Button, Card, CardContent, Skeleton } from '@lumen/uikit/components';
import { useGetPublicArticles } from '@/features/reading/hooks/use-reading';
import Image from 'next/image';
import { RouteEnum } from '@/shared/constants';
import { SectionHeading } from './section-heading';
import { fadeUpVariants, staggerContainer } from './animations';

function formatRelativeDate(iso: string): string {
  const date = new Date(iso);
  const diffDays = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (diffDays <= 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 30) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

function excerpt(content: string, max = 120): string {
  const text = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
}

export function ReadingSection() {
  const t = useTranslations('Index');
  const { data, isLoading, isError } = useGetPublicArticles(1, 6);

  const articles = data?.items ?? [];

  return (
    <section id="reading-library" className="scroll-mt-20 py-28 bg-muted/30">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-16 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            align="left"
            eyebrow={t('readingEyebrow')}
            title={t('readingTitle')}
            subtitle={t('readingSubtitle')}
            className="mb-0"
          />
          <Link href={RouteEnum.READING} className="shrink-0">
            <Button
              variant="outline"
              className="rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {t('readingViewAll')}
              <Icons name="arrow-right" className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="border-border overflow-hidden">
                <Skeleton className="h-48 w-full rounded-none" />
                <CardContent className="space-y-4 p-6">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {isError && !isLoading && (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center text-destructive">
            <p>{t('readingError')}</p>
          </div>
        )}

        {!isLoading && !isError && articles.length === 0 && (
          <div className="rounded-2xl border border-border bg-background p-8 text-center text-muted-foreground shadow-sm">
            <p>{t('readingEmpty')}</p>
          </div>
        )}

        {!isLoading && !isError && articles.length > 0 && (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {articles.map((article: any) => (
              <motion.div key={article.id} variants={fadeUpVariants} className="h-full">
                <Link href={`${RouteEnum.READING}/${article.id}`} className="h-full block">
                  <Card className="group flex h-full flex-col overflow-hidden border-border bg-background shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                    {article.imageUrl ? (
                      <div className="relative h-48 w-full overflow-hidden bg-muted">
                        <Image
                          src={article.imageUrl}
                          alt={article.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="relative h-48 w-full overflow-hidden bg-primary/5 flex items-center justify-center">
                        <Icons name="book-open" className="h-12 w-12 text-primary/20" />
                      </div>
                    )}
                    
                    <CardContent className="flex flex-1 flex-col p-6">
                      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-medium">
                        {article.difficultyLevel && (
                          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-primary">
                            {article.difficultyLevel}
                          </span>
                        )}
                        {article.category && (
                          <span className="rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-muted-foreground">
                            {article.category}
                          </span>
                        )}
                        {!article.difficultyLevel && !article.category && (
                          <span className="flex items-center text-muted-foreground">
                            <Icons name="clock" className="mr-1 h-3 w-3" />
                            {formatRelativeDate(article.createdAt)}
                          </span>
                        )}
                      </div>
                      
                      <h3 className="mb-3 text-lg font-bold leading-snug transition-colors group-hover:text-primary line-clamp-2">
                        {article.title}
                      </h3>
                      
                      <p className="mb-6 flex-1 text-sm text-muted-foreground line-clamp-3">
                        {excerpt(article.content)}
                      </p>
                      
                      <div className="mt-auto flex items-center font-medium text-primary">
                        <span className="text-sm">{t('readingReadMore')}</span>
                        <Icons name="arrow-right" className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
