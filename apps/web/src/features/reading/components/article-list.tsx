'use client';

import { useGetArticles } from '../hooks';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@lumen/uikit/components';
import { Button } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export const ArticleList = () => {
  const { data, isLoading, isError } = useGetArticles();
  const router = useRouter();
  const t = useTranslations('Dashboard.Sidebar'); // Just using some existing keys

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Icons name="loader-2" className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-destructive">
        <p>Failed to load articles. Please check if the backend is running.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Premium Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-500 via-emerald-500 to-green-500 p-8 text-white shadow-2xl"
      >
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
              Reading & Translation
            </h1>
            <p className="max-w-xl text-emerald-50 md:text-lg">
              Read authentic English articles. Highlight any word or sentence to
              instantly translate and add to your flashcards.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white/20 p-4 backdrop-blur-md">
              <span className="text-2xl font-bold">{data.total || 0}</span>
              <span className="text-xs font-medium uppercase tracking-wider text-emerald-100">
                Articles
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Articles Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.items?.map((article, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="group"
          >
            <Card className="flex h-full flex-col overflow-hidden border-none bg-white/60 shadow-lg backdrop-blur-xl transition-all duration-300 hover:shadow-xl dark:bg-slate-900/60">
              <CardHeader className="relative bg-gradient-to-b from-teal-50 to-transparent pb-4 dark:from-teal-950/50">
                <div className="mb-2 flex items-center justify-between">
                  <span className="inline-flex items-center rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-semibold text-teal-700 dark:bg-teal-900 dark:text-teal-300">
                    Article
                  </span>
                  <Icons name="newspaper" className="h-4 w-4 text-slate-400" />
                </div>
                <CardTitle className="line-clamp-2 text-xl leading-tight text-slate-800 dark:text-slate-200">
                  {article.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 text-sm text-slate-500 dark:text-slate-400">
                <p className="line-clamp-3">
                  {article.content.substring(0, 150)}...
                </p>
                <div className="mt-4 flex items-center gap-4 text-xs font-medium">
                  <div className="flex items-center gap-1 text-teal-600 dark:text-teal-400">
                    <Icons name="book-open" className="h-3 w-3" /> Reading
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Icons name="clock" className="h-3 w-3" />{' '}
                    {new Date(article.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button
                  className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 font-semibold text-white transition-all hover:from-teal-600 hover:to-emerald-700"
                  onClick={() =>
                    router.push(`/dashboard/reading/${article.id}`)
                  }
                >
                  Start Reading
                  <Icons
                    name="arrow-right"
                    className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                  />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
        {(!data.items || data.items.length === 0) && (
          <div className="col-span-full py-12 text-center text-slate-500">
            No articles found. Please add some articles via the backend.
          </div>
        )}
      </div>
    </div>
  );
};
