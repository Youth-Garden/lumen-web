'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { Button } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { ToeicQuestionDto } from '@/services/toeic';
import {
  RadarChart,
  RadarChartData,
} from '@/shared/components/charts/radar-chart';
import { RouteEnum } from '@/shared/constants/route';

import { calculateToeicScore } from '../../utils';
import { ToeicScoreSummary } from './toeic-score-summary';

interface ToeicResultDashboardProps {
  questions: ToeicQuestionDto[];
  userAnswers: Record<string, string>;
  timeSpentSeconds: number;
  onReview?: () => void;
}

export const ToeicResultDashboard = ({
  questions,
  userAnswers,
  timeSpentSeconds,
  onReview,
}: ToeicResultDashboardProps) => {
  const router = useRouter();
  const t = useTranslations('ToeicResultDashboard');

  // Calculate scores on the frontend
  const scoreResult = calculateToeicScore(questions, userAnswers);

  const radarData: RadarChartData[] = Object.keys(scoreResult.partScores).map(
    (key) => {
      const partNum = Number(key);
      return {
        subject: `Part ${partNum}`,
        value: scoreResult.partScores[partNum].percentage,
        fullMark: 100,
        correct: scoreResult.partScores[partNum].correct,
        total: scoreResult.partScores[partNum].total,
      };
    },
  );

  const topicData = Object.keys(scoreResult.topicScores).map((topic) => {
    const camelCaseTopic = topic
      .toLowerCase()
      .replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

    return {
      topic: t(`topics.${camelCaseTopic}` as any),
      percentage: scoreResult.topicScores[topic].percentage,
      correct: scoreResult.topicScores[topic].correct,
      total: scoreResult.topicScores[topic].total,
    };
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
        <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
      </motion.div>

      <ToeicScoreSummary
        totalScore={scoreResult.totalScore}
        listeningScore={scoreResult.listeningScore}
        readingScore={scoreResult.readingScore}
        timeSpentSeconds={timeSpentSeconds}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-1 bg-card border rounded-2xl shadow-sm p-6"
        >
          <h3 className="font-semibold text-lg mb-4 text-center">
            {t('performanceByPart')}
          </h3>
          <div className="h-[300px]">
            <RadarChart
              data={radarData}
              tooltipFormatter={(value: number, name: string, props: any) => [
                `${value}% (${props.payload.correct}/${props.payload.total})`,
                t('accuracy'),
              ]}
            />
          </div>
        </motion.div>

        {/* Detailed Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-card border rounded-2xl shadow-sm p-6"
        >
          <h3 className="font-semibold text-lg mb-4">
            {t('detailedBreakdown')}
          </h3>
          <div className="space-y-4">
            {Object.entries(scoreResult.partScores).map(([part, stats]) => {
              const partNum = Number(part);
              const isListening = partNum <= 4;
              return (
                <div key={part} className="flex items-center gap-4">
                  <div className="w-20 font-medium text-sm">
                    {t('part')} {partNum}
                  </div>
                  <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.percentage}%` }}
                      transition={{ duration: 1, delay: 0.6 + partNum * 0.1 }}
                      className={`h-full ${isListening ? 'bg-blue-500' : 'bg-emerald-500'}`}
                    />
                  </div>
                  <div className="w-24 text-right text-sm text-muted-foreground font-medium">
                    {stats.correct} / {stats.total}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {topicData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 bg-card border rounded-2xl shadow-sm p-6"
        >
          <h3 className="font-semibold text-lg mb-4">
            {t('performanceByTopic')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topicData.map((stat, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-foreground capitalize">
                    {stat.topic.toLowerCase()}
                  </span>
                  <span className="text-muted-foreground">
                    {stat.correct} / {stat.total}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.percentage}%` }}
                    transition={{ duration: 1, delay: 0.8 + idx * 0.1 }}
                    className="h-full bg-indigo-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-10 flex justify-center gap-4"
      >
        {onReview && (
          <Button size="lg" className="gap-2" onClick={onReview}>
            <Icons name="eye" className="h-5 w-5" />
            {t('reviewMode')}
          </Button>
        )}
        <Button
          size="lg"
          onClick={() => router.push(RouteEnum.DASHBOARD)}
          className="rounded-xl shadow-md hover:shadow-lg font-semibold"
        >
          {t('returnToDashboard')}
        </Button>
      </motion.div>
    </div>
  );
};
