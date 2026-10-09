import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Don't intercept static assets or API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  const host = (request.headers.get('host') || '').toLowerCase();
  const isComDomain = host.includes('checkoutstrategy.com') || host.endsWith('.com');
  const isSeDomain = host.includes('checkoutstrategi.se') || host.endsWith('.se');

  // Query parameter has highest priority: ?lang=en or ?lang=sv
  const langParam = searchParams.get('lang');
  let locale: 'en' | 'sv' = isComDomain ? 'en' : 'sv';

  if (langParam === 'en' || langParam === 'sv') {
    locale = langParam;
  } else {
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
    // If on .com domain, default to English unless explicitly set
    if (isComDomain) {
      locale = cookieLocale === 'sv' ? 'sv' : 'en';
    } else if (isSeDomain) {
      locale = cookieLocale === 'en' ? 'en' : 'sv';
    } else if (cookieLocale === 'en' || cookieLocale === 'sv') {
      locale = cookieLocale;
    }
  }

  // Clone request headers to pass detected locale to Server Components
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-locale', locale);
  requestHeaders.set('x-host', host);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Ensure cookie is set
  response.cookies.set('NEXT_LOCALE', locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'lax',
  });

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
