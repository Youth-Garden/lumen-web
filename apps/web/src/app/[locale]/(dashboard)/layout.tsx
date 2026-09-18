import { cookies } from 'next/headers';
import { DashboardLayout } from '@/features/dashboard/components/layout';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultCollapsed =
    cookieStore.get('sidebar_collapsed')?.value === 'true';

  return (
    <DashboardLayout defaultCollapsed={defaultCollapsed}>
      {children}
    </DashboardLayout>
  );
}
