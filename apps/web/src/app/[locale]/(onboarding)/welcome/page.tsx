import WelcomeLanguagePage from '@/features/auth/pages/welcome-language-page';
import { RouteEnum, getRouteMetadata } from '@/shared/constants';

export const metadata = getRouteMetadata(RouteEnum.WELCOME);

export default WelcomeLanguagePage;
