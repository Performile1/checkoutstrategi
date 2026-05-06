import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function AdminPlayersPage() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.user_metadata?.role !== 'admin') {
    redirect('/admin/login');
  }

  const { data: players } = await supabase
    .from('players')
    .select('*')
    .order('name');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="container-prose py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
              ← Tillbaka
            </Link>
            <h1 className="text-xl font-bold">Players</h1>
          </div>
          <Link
            href="/admin/players/new"
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus size={16} /> Lägg till player
          </Link>
        </div>
      </header>

      <div className="container-prose py-8">
        {players && players.length > 0 ? (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="text-left p-4 font-semibold">Namn</th>
                  <th className="text-left p-4 font-semibold">Kategori</th>
                  <th className="text-left p-4 font-semibold">Målmarknad</th>
                  <th className="text-left p-4 font-semibold">Konverteringsimpact</th>
                  <th className="text-right p-4 font-semibold">Åtgärder</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {players.map((player) => (
                  <tr key={player.id}>
                    <td className="p-4 font-medium">{player.name}</td>
                    <td className="p-4">{player.category}</td>
                    <td className="p-4">{player.target_market}</td>
                    <td className="p-4">{player.conversion_impact}/10</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/players/${player.id}`}
                          className="p-2 text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400"
                        >
                          <Edit size={16} />
                        </Link>
                        <form action={`/api/admin/players/${player.id}`} method="POST">
                          <input type="hidden" name="_method" value="DELETE" />
                          <button
                            type="submit"
                            className="p-2 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                          >
                            <Trash2 size={16} />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card text-center py-12">
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Inga players än
            </p>
            <Link href="/admin/players/new" className="btn-primary inline-flex items-center gap-2">
              <Plus size={16} /> Lägg till första player
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
