import LoginPage from '@/features/auth/pages/login-page';
import { RouteEnum, getRouteMetadata } from '@/shared/constants';

export const metadata = getRouteMetadata(RouteEnum.LOGIN);

export default LoginPage;
