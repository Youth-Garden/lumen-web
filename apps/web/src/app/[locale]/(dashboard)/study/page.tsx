import { StudyPage } from '@/features/vocabulary/pages/study-page';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Vocabulary.Study' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

import { Suspense } from 'react';

export default function StudyRoute() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading study session...</div>}>
      <StudyPage />
    </Suspense>
  );
}
