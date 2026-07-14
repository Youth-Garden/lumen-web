'use client';

import {
  ExamAttemptStatus,
  TestPlayerMode,
} from '@/services/exam-practice/exam-practice.types';
import { RouteEnum } from '@/shared/constants';
import { formatUrl } from '@/shared/utils';
import {
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@lumen/uikit/components';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  useMyAttempts,
  useStartRetest,
  useResumeExamAttempt,
} from '../hooks/use-exam-practice';

export const HistoryPage = () => {
  const t = useTranslations('ExamPractice');
  const router = useRouter();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: response, isLoading } = useMyAttempts(page, limit);
  const { mutate: startRetest, isPending: isStartingRetest } = useStartRetest();
  const resumeAttemptMutation = useResumeExamAttempt();

  const attempts = response?.items || [];
  const total = response?.paging.total || 0;
  const totalPages = Math.ceil(total / limit);

  const handleRetest = (attemptId: string) => {
    const attempt = attempts.find((a) => a.id === attemptId);
    if (!attempt) return;

    startRetest(attemptId, {
      onSuccess: (res) => {
        router.push(
          formatUrl(
            RouteEnum.TOEIC_TEST,
            { id: attempt.testId },
            { attemptId: res.id },
          ),
        );
      },
    });
  };

  const handleResume = (attemptId: string, testId: string) => {
    resumeAttemptMutation.mutate(attemptId, {
      onSuccess: () => {
        router.push(
          formatUrl(RouteEnum.TOEIC_TEST, { id: testId }, { attemptId }),
        );
      },
    });
  };

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">{t('myAttempts')}</h2>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('test')}</TableHead>
              <TableHead>{t('date')}</TableHead>
              <TableHead>{t('mode')}</TableHead>
              <TableHead>{t('score')}</TableHead>
              <TableHead>{t('status')}</TableHead>
              <TableHead className="text-right">{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  {t('loading')}
                </TableCell>
              </TableRow>
            ) : attempts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  {t('noAttempts')}
                </TableCell>
              </TableRow>
            ) : (
              attempts.map((attempt) => (
                <TableRow key={attempt.id}>
                  <TableCell className="font-medium">
                    {attempt.testId} ({attempt.testType})
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(attempt.startedAt), 'MMM dd, yyyy HH:mm')}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                      {attempt.mode}
                    </span>
                  </TableCell>
                  <TableCell>
                    {attempt.status === ExamAttemptStatus.COMPLETED ? (
                      <div className="flex flex-col text-xs">
                        <span className="font-medium text-sm text-primary">
                          Total: {attempt.totalScore}
                        </span>
                        <span className="text-muted-foreground">
                          L: {attempt.listeningScore} / R:{' '}
                          {attempt.readingScore}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${
                        attempt.status === ExamAttemptStatus.COMPLETED
                          ? 'bg-green-100 text-green-800'
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      }`}
                    >
                      {attempt.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {attempt.status === ExamAttemptStatus.COMPLETED && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          router.push(
                            formatUrl(
                              RouteEnum.TOEIC_TEST,
                              { id: attempt.testId },
                              {
                                attemptId: attempt.id,
                                mode: TestPlayerMode.REVIEW,
                              },
                            ),
                          );
                        }}
                      >
                        {t('view')}
                      </Button>
                    )}
                    {attempt.status === ExamAttemptStatus.IN_PROGRESS && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          router.push(
                            formatUrl(
                              RouteEnum.TOEIC_TEST,
                              { id: attempt.testId },
                              { attemptId: attempt.id },
                            ),
                          );
                        }}
                      >
                        {t('continue')}
                      </Button>
                    )}
                    {attempt.status === ExamAttemptStatus.PAUSED && (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={resumeAttemptMutation.isPending}
                        onClick={() => handleResume(attempt.id, attempt.testId)}
                      >
                        {t('resume')}
                      </Button>
                    )}
                    {attempt.status === ExamAttemptStatus.COMPLETED &&
                      attempt.totalCorrect < attempt.totalAnswered && (
                        <Button
                          variant="secondary"
                          size="sm"
                          disabled={isStartingRetest}
                          onClick={() => handleRetest(attempt.id)}
                        >
                          {t('retestIncorrect')}
                        </Button>
                      )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <span className="flex items-center px-4 text-sm">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
