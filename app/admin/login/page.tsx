'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getLocalAdminUser, setLocalAdminUser } from '@/components/AdminGuard';
import { ShieldCheck, ArrowRight } from 'lucide-react';

function AdminLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawTarget = searchParams.get('redirect') || '/admin';
  const redirectTarget = (!rawTarget || rawTarget.startsWith('/admin/login')) ? '/admin' : rawTarget;

  useEffect(() => {
    // If already logged in, go straight to admin
    const user = getLocalAdminUser();
    if (user) {
      window.location.href = redirectTarget;
    }
  }, [redirectTarget]);

  const executeLogin = async (loginEmail: string, loginPassword?: string) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword || 'admin' }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        setError(data.error || 'Felaktiga inloggningsuppgifter');
        setLoading(false);
        return;
      }

      if (data.user) {
        setLocalAdminUser(data.user);
      }
      const token = data.token || btoa(JSON.stringify({ email: data.user?.email || loginEmail, role: 'admin', createdAt: new Date().toISOString() }));
      localStorage.setItem('checkout_admin_token', token);
      try {
        const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
        document.cookie = `checkout_admin_session=${token}; path=/; max-age=2592000; SameSite=Lax${isHttps ? '; Secure' : ''}`;
        document.cookie = `checkout_admin_token=${token}; path=/; max-age=2592000; SameSite=Lax${isHttps ? '; Secure' : ''}`;
      } catch {}

      // Hard redirect to ensure server receives the newly set cookie on full page reload
      window.location.href = redirectTarget;
    } catch {
      setError('Ett nätverksfel uppstod. Försök igen.');
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await executeLogin(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="card max-w-md w-full p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2 text-brand-600">
          <ShieldCheck size={24} />
          <span className="text-xs font-semibold uppercase tracking-wider">Adminportal</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">Logga in på Dashboard</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          Ange dina administratörsuppgifter för att hantera Checkoutstrategi.
        </p>

        {error && (
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1.5">
              E-post
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="din@epost.se"
              className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1.5">
              Lösenord
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary justify-center py-2.5"
          >
            {loading ? 'Loggar in...' : 'Logga in'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
          <div className="card max-w-md w-full p-8 text-center shadow-md">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto mb-4" />
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Laddar inloggning...
            </p>
          </div>
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}

