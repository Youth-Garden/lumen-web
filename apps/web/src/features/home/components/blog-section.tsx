'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Icons } from '@lumen/uikit/icons';
import { Button, Card, CardContent, Skeleton } from '@lumen/uikit/components';
import { useGetPublicArticles } from '@/features/reading/hooks/use-reading';
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

function excerpt(content: string, max = 140): string {
  const text = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
}

export function BlogSection() {
  const t = useTranslations('Index');
  const { data, isLoading, isError } = useGetPublicArticles(1, 6);

  const articles = data?.items ?? [];

  return (
    <section id="blog" className="scroll-mt-20 py-28">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-16 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            align="left"
            eyebrow={t('blogEyebrow')}
            title={t('blogTitle')}
            subtitle={t('blogSubtitle')}
            className="mb-0"
          />
          <Link href={RouteEnum.READING} className="shrink-0">
            <Button
              variant="outline"
              className="rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {t('blogViewAll')}
              <Icons name="arrow-right" className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="border-border p-6">
                <CardContent className="space-y-4 p-0">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                  <Skeleton className="h-3 w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {isError && !isLoading && (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center text-destructive">
            <p>{t('blogError')}</p>
          </div>
        )}

        {!isLoading && !isError && articles.length === 0 && (
          <div className="rounded-2xl border border-border bg-muted/30 p-8 text-center text-muted-foreground">
            <p>{t('blogEmpty')}</p>
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
            {articles.map((article) => (
              <motion.div key={article.id} variants={fadeUpVariants}>
                <Link href={`${RouteEnum.READING}/${article.id}`}>
                  <Card className="group h-full border-border p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                    <CardContent className="flex h-full flex-col p-0">
                      <div className="mb-3 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <Icons name="newspaper" className="h-4 w-4 text-primary" />
                        <span>{formatRelativeDate(article.createdAt)}</span>
                      </div>
                      <h3 className="mb-2 text-lg font-bold leading-snug transition-colors group-hover:text-primary">
                        {article.title}
                      </h3>
                      <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                        {excerpt(article.content)}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                        {t('blogReadMore')}
                        <Icons
                          name="arrow-right"
                          className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        />
                      </span>
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
