'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { Button } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { RouteEnum } from '@/shared/constants';
import { useRouter } from 'next/navigation';
import { useSpeakingTasks } from '../hooks/use-speaking';
import { SpeakingRecorder } from '../components/speaking-recorder';

export const SpeakingTaskPage = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const t = useTranslations('Speaking');

  // In a real app we'd have a getTaskById endpoint, but since we only have getTasks,
  // we'll fetch the list and find the task. This is a workaround for the current API.
  const { data, isLoading } = useSpeakingTasks({ limit: 100 });

  const task = data?.items?.find((taskItem) => taskItem.id === params.id);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Icons name="loader-2" className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Icons
          name="file-question"
          className="h-12 w-12 text-muted-foreground"
        />
        <p className="text-muted-foreground">{t('noTasks')}</p>
        <Button
          variant="outline"
          onClick={() => router.push(RouteEnum.SPEAKING)}
        >
          {t('backToTasks')}
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 py-8 md:p-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link
          href={RouteEnum.SPEAKING}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-6 bg-muted/50 px-3 py-1.5 rounded-full"
        >
          <Icons name="arrow-left" className="mr-2 h-4 w-4" />
          {t('backToTasks')}
        </Link>

        <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary">
              <Icons name="mic" className="h-5 w-5" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {task.title}
            </h1>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-6">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
              {t('prompt')}
            </h3>
            <p className="text-lg leading-relaxed text-foreground">
              {task.prompt}
            </p>
          </div>

          {task.keywords.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                {t('keywords')}:
              </h3>
              <div className="flex flex-wrap gap-2">
                {task.keywords.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-muted text-muted-foreground border shadow-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {task.referenceAudioUrl && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                {t('referenceAudio')}:
              </h3>
              <audio
                src={task.referenceAudioUrl}
                controls
                className="w-full h-10"
              />
            </div>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <SpeakingRecorder task={task} />
      </motion.div>
    </div>
  );
};
