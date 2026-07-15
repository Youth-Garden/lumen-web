'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { cn } from '@lumen/uikit/utils';
import type { GrammarLessonDto } from '@/services/grammar';
import { useLessonExercises } from '../hooks/use-grammar';
import { GrammarExercise } from './grammar-exercise';

interface GrammarLessonDetailProps {
  lesson: GrammarLessonDto;
}

export const GrammarLessonDetail = ({ lesson }: GrammarLessonDetailProps) => {
  const t = useTranslations('Grammar');
  const [showExercises, setShowExercises] = useState(false);
  const { data: exercises, isLoading } = useLessonExercises(lesson.id);

  return (
    <div className="space-y-8">
      {/* Lesson Content */}
      <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-6">{lesson.title}</h2>
        <div
          className="prose prose-blue dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-primary"
          dangerouslySetInnerHTML={{ __html: lesson.content }}
        />

        <div className="mt-8 pt-6 border-t flex justify-center">
          <Button
            size="lg"
            className="rounded-xl px-8"
            onClick={() => setShowExercises(!showExercises)}
          >
            {showExercises ? t('lessons') : t('practiceExercises')}
            <Icons
              name={showExercises ? 'chevron-up' : 'chevron-down'}
              className="ml-2 h-4 w-4"
            />
          </Button>
        </div>
      </div>

      {/* Exercises Section */}
      <AnimatePresence>
        {showExercises && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Icons name="pen-tool" className="text-primary h-5 w-5" />
                {t('practiceExercises')}
              </h3>

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Icons
                    name="loader-2"
                    className="h-8 w-8 animate-spin text-primary"
                  />
                </div>
              ) : !exercises || exercises.length === 0 ? (
                <div className="bg-muted/50 rounded-2xl p-8 text-center text-muted-foreground border border-dashed">
                  {t('noExercises')}
                </div>
              ) : (
                <div className="grid gap-6">
                  {exercises.map((exercise, index) => (
                    <motion.div
                      key={exercise.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <GrammarExercise exercise={exercise} />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
