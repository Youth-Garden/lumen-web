'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { GrammarTopicList } from '../components/grammar-topic-list';

export const GrammarListPage = () => {
  const t = useTranslations('Grammar');

  return (
    <div className="container mx-auto p-4 py-8 md:p-8 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          {t('subtitle')}
        </p>
      </motion.div>

      <GrammarTopicList />
    </div>
  );
};
