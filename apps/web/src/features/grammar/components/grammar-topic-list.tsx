'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';

import { Icons } from '@lumen/uikit/icons';
import { RouteEnum } from '@/shared/constants';
import { formatUrl } from '@lumen/shared-api';
import type { GrammarTopicDto } from '@/services/grammar';
import { useGrammarTopics } from '../hooks/use-grammar';

const CEFR_COLORS: Record<string, string> = {
  A1: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  A2: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  B1: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  B2: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  C1: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  C2: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
};

interface TopicCardProps {
  topic: GrammarTopicDto;
  index: number;
}

const TopicCard = ({ topic, index }: TopicCardProps) => {
  const t = useTranslations('Grammar');
  const cefrColor = CEFR_COLORS[topic.cefrLevel] ?? 'bg-secondary text-secondary-foreground';
  const lessonCount = topic.lessons?.length ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={formatUrl(RouteEnum.GRAMMAR_TOPIC, { id: topic.id })}>
        <div className="group bg-card border rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-200 cursor-pointer h-full">
          <div className="flex items-start justify-between mb-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cefrColor}`}>
              {topic.cefrLevel}
            </span>
            {lessonCount > 0 && (
              <span className="text-xs text-muted-foreground">
                {lessonCount} {t('lessons')}
              </span>
            )}
          </div>
          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
            {topic.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-3">{topic.description}</p>
          <div className="mt-4 flex items-center gap-1 text-primary text-sm font-medium">
            <span>{t('startLesson')}</span>
            <Icons name="chevron-right" className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export const GrammarTopicList = () => {
  const t = useTranslations('Grammar');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useGrammarTopics({
    page: 1,
    limit: 50,
    search: search || undefined,
  });

  const topics = data?.items ?? [];

  return (
    <div>
      {/* Search */}
      <div className="relative mb-6">
        <Icons name="search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Icons name="loader-2" className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : topics.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <Icons name="file-text" className="h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">{t('noTopics')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((topic, index) => (
            <TopicCard key={topic.id} topic={topic} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};
