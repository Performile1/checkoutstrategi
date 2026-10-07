import { cookies, headers } from 'next/headers';
import type { NextRequest } from 'next/server';

export interface AdminUser {
  email: string;
  role: 'admin';
  user_metadata: {
    role: 'admin';
    name?: string;
  };
}

export const ADMIN_COOKIE_NAME = 'checkout_admin_session';

export function createAdminToken(email: string): string {
  const sessionData = {
    email: email.trim().toLowerCase(),
    role: 'admin',
    createdAt: new Date().toISOString(),
  };
  return Buffer.from(JSON.stringify(sessionData)).toString('base64');
}

export function parseAdminToken(token: string): AdminUser | null {
  try {
    if (!token) return null;
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
    if (decoded && decoded.email && decoded.role === 'admin') {
      return {
        email: decoded.email,
        role: 'admin',
        user_metadata: {
          role: 'admin',
          name: decoded.name || decoded.email.split('@')[0],
        },
      };
    }
  } catch {
    // invalid token
  }
  return null;
}

export async function getAdminUser(request?: Request | NextRequest): Promise<AdminUser | null> {
  // 1. Check passed request headers if available
  if (request) {
    const authHeader = request.headers.get('authorization') || '';
    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7).trim();
      const user = parseAdminToken(token);
      if (user) return user;
    }

    const customToken = request.headers.get('x-admin-token');
    if (customToken) {
      const user = parseAdminToken(customToken);
      if (user) return user;
    }

    // Check request.cookies if NextRequest
    if ('cookies' in request && (request as NextRequest).cookies) {
      const nextReq = request as NextRequest;
      const sessionVal =
        nextReq.cookies.get(ADMIN_COOKIE_NAME)?.value ||
        nextReq.cookies.get('checkout_admin_token')?.value;
      if (sessionVal) {
        const user = parseAdminToken(sessionVal);
        if (user) return user;
      }
    }

    // Check Cookie header string
    const cookieHeader = request.headers.get('cookie') || '';
    if (cookieHeader) {
      const match = cookieHeader.match(/(?:^|;\s*)(?:checkout_admin_session|checkout_admin_token)=([^;]+)/);
      if (match && match[1]) {
        const user = parseAdminToken(decodeURIComponent(match[1]));
        if (user) return user;
      }
    }
  }

  // 2. Check next/headers (works in Server Components & Route Handlers)
  try {
    const headerList = headers();
    const authHeader = headerList.get('authorization') || '';
    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7).trim();
      const user = parseAdminToken(token);
      if (user) return user;
    }

    const customToken = headerList.get('x-admin-token');
    if (customToken) {
      const user = parseAdminToken(customToken);
      if (user) return user;
    }

    const cookieHeader = headerList.get('cookie') || '';
    if (cookieHeader) {
      const match = cookieHeader.match(/(?:^|;\s*)(?:checkout_admin_session|checkout_admin_token)=([^;]+)/);
      if (match && match[1]) {
        const user = parseAdminToken(decodeURIComponent(match[1]));
        if (user) return user;
      }
    }
  } catch {
    // headers() not available in current execution context
  }

  // 3. Check cookies
  try {
    const cookieStore = cookies();
    const sessionCookie =
      cookieStore.get(ADMIN_COOKIE_NAME)?.value ||
      cookieStore.get('checkout_admin_token')?.value;
    if (sessionCookie) {
      const user = parseAdminToken(sessionCookie);
      if (user) return user;
    }
  } catch {
    // cookies() context not available
  }

  return null;
}

