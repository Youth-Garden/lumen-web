import { StudyPage } from '@/features/vocabulary/pages/study-page';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Vocabulary.Study' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default StudyPage;
