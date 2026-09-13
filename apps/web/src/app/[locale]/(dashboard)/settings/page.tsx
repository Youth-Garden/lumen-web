import { SettingsPage } from '@/features/settings/pages/settings-page';
import { RouteEnum, getRouteMetadata } from '@/shared/constants';

export const metadata = getRouteMetadata(RouteEnum.SETTINGS);

export default SettingsPage;
