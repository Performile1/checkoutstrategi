'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export interface AdminLocalUser {
  email: string;
  role: 'admin';
  name?: string;
}

export function getLocalAdminUser(): AdminLocalUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem('checkout_admin_user');
    if (!data) return null;
    const parsed = JSON.parse(data);
    if (parsed && parsed.email && parsed.role === 'admin') {
      return parsed;
    }
  } catch {
    // ignore
  }
  return null;
}

export function setLocalAdminUser(user: AdminLocalUser) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('checkout_admin_user', JSON.stringify(user));
}

export function getLocalAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('checkout_admin_token') || null;
}

export function getAdminAuthHeaders(): Record<string, string> {
  const token = getLocalAdminToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    headers['x-admin-token'] = token;
  }
  return headers;
}

export function clearLocalAdminUser() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('checkout_admin_user');
  localStorage.removeItem('checkout_admin_token');
  try {
    document.cookie = 'checkout_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'checkout_admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  } catch {}
}

export function AdminGuard({
  children,
  serverAuthenticated = false,
  userEmail,
}: {
  children: React.ReactNode;
  serverAuthenticated?: boolean;
  userEmail?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState<boolean>(serverAuthenticated);
  const [loading, setLoading] = useState<boolean>(!serverAuthenticated);

  useEffect(() => {
    if (serverAuthenticated) {
      setAuthorized(true);
      setLoading(false);
      if (userEmail) {
        setLocalAdminUser({ email: userEmail, role: 'admin' });
      }
      return;
    }

    const localUser = getLocalAdminUser();
    if (localUser) {
      setAuthorized(true);
      setLoading(false);
      // Attempt background cookie sync for environments that support cookies
      fetch('/api/auth/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: localUser.email }),
      }).catch(() => {});
      return;
    }

    setAuthorized(false);
    setLoading(false);
    if (pathname && !pathname.startsWith('/admin/login')) {
      router.push(`/admin/login?redirect=${encodeURIComponent(pathname || '/admin')}`);
    }
  }, [serverAuthenticated, userEmail, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="card text-center p-8 max-w-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto mb-4" />
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Kontrollerar inloggning...</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="card text-center p-8 max-w-sm">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Du måste logga in för att se denna sida.</p>
          <button
            onClick={() => router.push('/admin/login')}
            className="btn-primary w-full justify-center"
          >
            Till inloggningen
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
