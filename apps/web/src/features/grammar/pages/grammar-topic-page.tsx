'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { Button } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { RouteEnum } from '@/shared/constants';
import { useRouter } from 'next/navigation';
import { useGrammarTopicDetail } from '../hooks/use-grammar';
import { GrammarTopicDetail } from '../components/grammar-topic-detail';

export const GrammarTopicPage = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const t = useTranslations('Grammar');
  const { data: topic, isLoading } = useGrammarTopicDetail(params.id);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Icons name="loader-2" className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Icons
          name="file-question"
          className="h-12 w-12 text-muted-foreground"
        />
        <p className="text-muted-foreground">{t('noTopics')}</p>
        <Button
          variant="outline"
          onClick={() => router.push(RouteEnum.GRAMMAR)}
        >
          {t('backToTopics')}
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 py-8 md:p-8 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link
          href={RouteEnum.GRAMMAR}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
        >
          <Icons name="arrow-left" className="mr-2 h-4 w-4" />
          {t('backToTopics')}
        </Link>
        <h1 className="text-3xl font-bold text-foreground">{topic.title}</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          {topic.description}
        </p>
      </motion.div>

      <GrammarTopicDetail topic={topic} />
    </div>
  );
};
