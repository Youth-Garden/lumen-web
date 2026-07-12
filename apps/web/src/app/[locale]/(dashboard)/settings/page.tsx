import { getTranslations } from 'next-intl/server';
import { SettingsPage } from '@/features/settings/pages/settings-page';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'Settings' });
  return {
    title: t('title'),
  };
}

export default function SettingsRoute() {
  return <SettingsPage />;
}
