import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { JWT_ACCESS_TOKEN_KEY, RouteEnum } from './shared/constants';
import { routing } from './shared/i18n/routing';

const intlMiddleware = createMiddleware(routing);

const publicRoutes = [RouteEnum.LOGIN];

export default function middleware(req: NextRequest) {
  const token = req.cookies.get(JWT_ACCESS_TOKEN_KEY)?.value;
  const path = req.nextUrl.pathname;

  let normalizedPath = path;
  for (const locale of routing.locales) {
    if (path.startsWith(`/${locale}/`) || path === `/${locale}`) {
      normalizedPath = path.substring(locale.length + 1) || '/';
      break;
    }
  }

  if (normalizedPath === '/') {
    if (!token) {
      return NextResponse.redirect(new URL(RouteEnum.LOGIN, req.url));
    }
  }

  if (token && normalizedPath.startsWith(RouteEnum.LOGIN)) {
    return NextResponse.redirect(new URL(RouteEnum.DASHBOARD, req.url));
  }

  const isPublic = publicRoutes.some((route) =>
    normalizedPath.startsWith(route),
  );

  if (!isPublic && !token) {
    const loginUrl = new URL(RouteEnum.LOGIN, req.url);
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
