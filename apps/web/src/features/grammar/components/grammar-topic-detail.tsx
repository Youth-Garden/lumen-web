'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Icons } from '@lumen/uikit/icons';
import { cn } from '@lumen/uikit/utils';
import type { GrammarTopicDto } from '@/services/grammar';
import { GrammarLessonDetail } from './grammar-lesson-detail';

interface GrammarTopicDetailProps {
  topic: GrammarTopicDto;
}

export const GrammarTopicDetail = ({ topic }: GrammarTopicDetailProps) => {
  const t = useTranslations('Grammar');
  const lessons = topic.lessons ?? [];
  const [activeLessonId, setActiveLessonId] = useState<string | null>(
    lessons.length > 0 ? lessons[0].id : null,
  );

  const activeLesson = lessons.find((l) => l.id === activeLessonId);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar - Lessons List */}
      <div className="w-full lg:w-80 shrink-0">
        <div className="bg-card border rounded-2xl overflow-hidden sticky top-24 shadow-sm">
          <div className="p-4 border-b bg-muted/30">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Icons name="book" className="h-5 w-5 text-primary" />
              {t('lessons')}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{topic.title}</p>
          </div>

          <div className="p-2 space-y-1">
            {lessons.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground text-center">
                {t('noExercises')}
              </div>
            ) : (
              lessons.map((lesson, index) => {
                const isActive = activeLessonId === lesson.id;
                return (
                  <button
                    key={lesson.id}
                    onClick={() => setActiveLessonId(lesson.id)}
                    className={cn(
                      'w-full flex items-center gap-3 text-left p-3 rounded-xl transition-all duration-200 text-sm font-medium',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-muted text-foreground',
                    )}
                  >
                    <div
                      className={cn(
                        'flex items-center justify-center h-6 w-6 rounded-full text-xs shrink-0',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted-foreground/20 text-muted-foreground',
                      )}
                    >
                      {index + 1}
                    </div>
                    <span className="line-clamp-2">{lesson.title}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Main Content - Active Lesson */}
      <div className="flex-1 min-w-0">
        {activeLesson ? (
          <motion.div
            key={activeLesson.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GrammarLessonDetail lesson={activeLesson} />
          </motion.div>
        ) : (
          <div className="bg-card border rounded-2xl p-12 text-center shadow-sm">
            <Icons
              name="layout-dashboard"
              className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50"
            />
            <p className="text-muted-foreground">{t('noExercises')}</p>
          </div>
        )}
      </div>
    </div>
  );
};
