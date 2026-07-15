'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { SpeakingTaskList } from '../components/speaking-task-list';

export const SpeakingListPage = () => {
  const t = useTranslations('Speaking');

  return (
    <div className="container mx-auto p-4 py-8 md:p-8 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" x2="12" y1="19" y2="22" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
        <p className="text-muted-foreground mt-2 text-lg max-w-2xl">
          {t('subtitle')}
        </p>
      </motion.div>

      <SpeakingTaskList />
    </div>
  );
};
