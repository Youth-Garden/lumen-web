import { StudyPage } from '@/features/vocabulary/pages/study';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Vocabulary.Study' });

  return {
    title: t('title', { fallback: 'Study Flashcards' }),
    description: t('description', { fallback: 'Review your vocabulary using spaced repetition' }),
  };
}

export default function StudyRoute() {
  return <StudyPage />;
}
