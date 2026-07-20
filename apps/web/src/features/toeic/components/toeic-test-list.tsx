'use client';

import { RouteEnum } from '@/shared/constants';
import { formatUrl } from '@lumen/shared-api';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { AdaptiveDrillWidget } from './adaptive-drill-widget';
import { WeaknessRadar } from './weakness-radar';
import { useGetToeicTests } from '../hooks';

export const ToeicTestList = () => {
  const { data, isLoading, isError } = useGetToeicTests();
  const router = useRouter();
  const t = useTranslations('ToeicTestList');

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
        <p>{t('errorLoad')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 text-white shadow-2xl"
      >
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
              {t('title')}
            </h1>
            <p className="max-w-xl text-indigo-100 md:text-lg">
              {t('description')}
            </p>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white/20 p-4 backdrop-blur-md">
              <span className="text-2xl font-bold">
                {data.meta?.totalItems || 0}
              </span>
              <span className="text-xs font-medium uppercase tracking-wider text-indigo-100">
                {t('availableTests')}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Adaptive Weakness & Micro-Drill Section */}
      <div className="space-y-6">
        <AdaptiveDrillWidget />
        <WeaknessRadar />
      </div>

      {/* Tests Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">
          Standard Mock Tests
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.items?.map((test, index) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Card className="h-full overflow-hidden border-none bg-white/60 shadow-lg backdrop-blur-xl transition-all duration-300 hover:shadow-xl dark:bg-slate-900/60">
                <CardHeader className="relative bg-gradient-to-b from-indigo-50 to-transparent pb-4 dark:from-indigo-950/50">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300">
                      {t('fullTest')}
                    </span>
                    <div className="flex space-x-1">
                      <Icons
                        name="headphones"
                        className="h-4 w-4 text-slate-400"
                      />
                      <Icons
                        name="book-open"
                        className="h-4 w-4 text-slate-400"
                      />
                    </div>
                  </div>
                  <CardTitle className="line-clamp-1 text-xl">
                    {test.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {test.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 pb-4 pt-4 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <Icons name="clock" className="h-4 w-4 text-primary" />
                    <span>120 mins</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icons name="bar-chart" className="h-4 w-4 text-primary" />
                    <span>200 Questions</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 font-semibold text-white transition-all hover:from-indigo-600 hover:to-purple-700"
                    onClick={() =>
                      router.push(
                        formatUrl(RouteEnum.TOEIC_TEST, { id: test.id }),
                      )
                    }
                  >
                    {t('startTest')}
                    <Icons
                      name="arrow-right"
                      className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                    />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
