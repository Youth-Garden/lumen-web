import { redirect } from 'next/navigation';
import { RouteEnum } from '@/shared/constants';

export default function OverviewRedirectPage() {
  redirect(RouteEnum.HOME);
}
