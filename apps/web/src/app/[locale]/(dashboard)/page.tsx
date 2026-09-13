import { OverviewPage } from '@/features/dashboard/pages/overview-page';
import { RouteEnum, getRouteMetadata } from '@/shared/constants';

export const metadata = getRouteMetadata(RouteEnum.DASHBOARD);

export default OverviewPage;
