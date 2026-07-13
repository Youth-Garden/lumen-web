import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { RouteEnum } from './shared/constants';
import { routing } from './shared/i18n/routing';

const intlMiddleware = createMiddleware(routing);

const protectedRoutes = [
  RouteEnum.DASHBOARD,
  RouteEnum.PROFILE,
  RouteEnum.SETTINGS,
];
const publicOnlyRoutes = [
  RouteEnum.LOGIN,
  RouteEnum.REGISTER,
  RouteEnum.FORGOT_PASSWORD,
];

import { JWT_ACCESS_TOKEN_KEY } from './shared/constants';

export default function middleware(req: NextRequest) {
  const token = req.cookies.get(JWT_ACCESS_TOKEN_KEY)?.value;
  const path = req.nextUrl.pathname;

  // We need to check the path ignoring the locale prefix (e.g. /vi/dashboard -> /dashboard)
  let normalizedPath = path;
  for (const locale of routing.locales) {
    if (path.startsWith(`/${locale}/`) || path === `/${locale}`) {
      normalizedPath = path.substring(locale.length + 1) || '/';
      break;
    }
  }

  const isProtected = protectedRoutes.some((route) =>
    normalizedPath.startsWith(route),
  );
  const isPublicOnly = publicOnlyRoutes.some((route) =>
    normalizedPath.startsWith(route),
  );

  if (isProtected && !token) {
    const loginUrl = new URL(RouteEnum.LOGIN, req.url);
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isPublicOnly && token) {
    return NextResponse.redirect(new URL(RouteEnum.DASHBOARD, req.url));
  }

  // Redirect authenticated users from home to dashboard
  if (normalizedPath === '/' && token) {
    return NextResponse.redirect(new URL(RouteEnum.DASHBOARD, req.url));
  }

  // Pass to next-intl middleware for locale handling
  return intlMiddleware(req);
}

export const config = {
  // Match all pathnames except for api, _next/static, _next/image, favicon.ico, etc.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
