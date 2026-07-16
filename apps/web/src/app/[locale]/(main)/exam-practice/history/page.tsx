import { HistoryPage } from '@/features/exam-practice/pages/history-page';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations('ExamPractice');
  return {
    title: t('myAttempts'),
  };
}

export default HistoryPage;


