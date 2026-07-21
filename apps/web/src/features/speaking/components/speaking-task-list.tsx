'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';

import { Icons } from '@lumen/uikit/icons';
import { RouteEnum } from '@/shared/constants';
import { formatUrl } from '@lumen/shared-api';
import type { SpeakingTaskDto } from '@/services/speaking';
import { useSpeakingTasks } from '../hooks/use-speaking';
import { HighlightText } from '@/shared/components/highlight-text';
import { CategoryNav, type CategoryDef } from '@/shared/components/category-nav';

const SPEAKING_CATEGORIES: CategoryDef[] = [
  { value: 'Daily Conversation', labelKey: 'Daily Conversation' },
  { value: 'Describe a Picture', labelKey: 'Describe a Picture' },
  { value: 'Opinion & Discussion', labelKey: 'Opinion & Discussion' },
  { value: 'Pronunciation', labelKey: 'Pronunciation' },
];

const TaskCard = ({
  task,
  index,
  searchQuery = '',
}: {
  task: SpeakingTaskDto;
  index: number;
  searchQuery?: string;
}) => {
  const t = useTranslations('Speaking');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="h-full"
    >
      <Link href={formatUrl(RouteEnum.SPEAKING_TASK, { id: task.id })}>
        <div className="group bg-card border rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-200 cursor-pointer h-full flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
              <Icons name="mic" className="h-5 w-5" />
            </div>
            <div className="flex flex-col items-end gap-1">
              {task.category && (
                <span className="text-xs font-medium text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
                  {task.category}
                </span>
              )}
              {task.keywords.length > 0 && (
                <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full">
                  {task.keywords.length} {t('keywords')}
                </span>
              )}
            </div>
          </div>

          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
            <HighlightText text={task.title} query={searchQuery} />
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1">
            <HighlightText text={task.prompt} query={searchQuery} />
          </p>

          <div className="flex items-center text-primary text-sm font-medium mt-auto">
            <span>{t('record')}</span>
            <Icons
              name="arrow-right"
              className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform"
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export const SpeakingTaskList = () => {
  const t = useTranslations('Speaking');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | undefined>(undefined);

  const { data, isLoading } = useSpeakingTasks({
    page: 1,
    limit: 20,
    search: search || undefined,
    category,
  });

  const tasks = data?.items ?? [];

  return (
    <div>
      <CategoryNav
        categories={SPEAKING_CATEGORIES}
        searchPlaceholder="Search speaking tasks..."
        filterByLevelLabel={t('filterByLevel')}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
        showLevelFilter={false}
      />

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Icons
            name="loader-2"
            className="h-8 w-8 animate-spin text-primary"
          />
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center border-2 border-dashed border-border rounded-2xl bg-muted/10">
          <Icons
            name="mic-off"
            className="h-12 w-12 text-muted-foreground opacity-50"
          />
          <p className="text-muted-foreground font-medium">{t('noTasks')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              index={index}
              searchQuery={search}
            />
          ))}
        </div>
      )}
    </div>
  );
};
