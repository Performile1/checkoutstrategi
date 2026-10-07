import { cookies } from 'next/headers';

export interface AdminUser {
  email: string;
  role: 'admin';
  user_metadata: {
    role: 'admin';
    name?: string;
  };
}

export const ADMIN_COOKIE_NAME = 'checkout_admin_session';

export async function getAdminUser(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

    if (sessionCookie) {
      try {
        const decoded = JSON.parse(Buffer.from(sessionCookie, 'base64').toString('utf8'));
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
        // invalid cookie format
      }
    }
  } catch {
    // cookies() context not available
  }

  return null;
}
