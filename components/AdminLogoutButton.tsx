'use client';

import { LogOut } from 'lucide-react';
import { clearLocalAdminUser } from '@/components/AdminGuard';
import { useRouter } from 'next/navigation';

export function AdminLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    clearLocalAdminUser();
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition"
    >
      <LogOut size={16} /> Logga ut
    </button>
  );
}
