'use client';

import { Icons } from '@lumen/uikit/icons';
import { motion } from 'framer-motion';
import { formatDuration } from '@/shared/utils';

interface ToeicScoreSummaryProps {
  totalScore: number;
  listeningScore: number;
  readingScore: number;
  timeSpentSeconds: number;
}

export const ToeicScoreSummary = ({
  totalScore,
  listeningScore,
  readingScore,
  timeSpentSeconds,
}: ToeicScoreSummaryProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Total Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-primary text-primary-foreground p-6 rounded-2xl shadow-lg relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <Icons name="trophy" className="w-24 h-24" />
        </div>
        <h3 className="text-lg font-medium opacity-90 mb-1">Total Score</h3>
        <div className="text-5xl font-bold flex items-baseline gap-2">
          {totalScore}{' '}
          <span className="text-xl font-normal opacity-80">/ 990</span>
        </div>
      </motion.div>

      {/* Listening & Reading Scores */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border p-6 rounded-2xl shadow-sm flex flex-col justify-center"
      >
        <div className="flex items-center justify-between mb-3 border-b pb-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icons name="headphones" className="w-5 h-5 text-blue-500" />
            <span className="font-medium">Listening</span>
          </div>
          <div className="text-2xl font-bold">
            {listeningScore}{' '}
            <span className="text-sm font-normal text-muted-foreground">
              / 495
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icons name="book-open" className="w-5 h-5 text-emerald-500" />
            <span className="font-medium">Reading</span>
          </div>
          <div className="text-2xl font-bold">
            {readingScore}{' '}
            <span className="text-sm font-normal text-muted-foreground">
              / 495
            </span>
          </div>
        </div>
      </motion.div>

      {/* Time Spent */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card border p-6 rounded-2xl shadow-sm flex flex-col justify-center items-center"
      >
        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950/50 rounded-full flex items-center justify-center mb-3">
          <Icons name="clock" className="w-6 h-6 text-orange-500" />
        </div>
        <h3 className="text-muted-foreground font-medium mb-1">Time Spent</h3>
        <div className="text-2xl font-bold">{formatDuration(timeSpentSeconds)}</div>
      </motion.div>
    </div>
  );
};
