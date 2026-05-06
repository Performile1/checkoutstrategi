import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { Check, X, Trash2, Star, ExternalLink } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hantera Recensioner - Admin Dashboard',
  description: 'Godkänn eller ta bort recensioner från användare.',
  alternates: { canonical: '/admin/reviews' },
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function AdminReviewsPage() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.user_metadata?.role !== 'admin') {
    redirect('/admin/login');
  }

  // Fetch all reviews with player info
  const { data: reviews } = await supabase
    .from('reviews')
    .select(`
      *,
      players (name, slug)
    `)
    .order('created_at', { ascending: false });

  // Fetch players for dropdown
  const { data: players } = await supabase
    .from('players')
    .select('id, name, slug')
    .order('name');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="container-prose py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
              ← Tillbaka
            </Link>
            <h1 className="text-xl font-bold">Reviews Management</h1>
          </div>
          <span className="text-sm text-slate-600 dark:text-slate-400">
            {reviews?.length || 0} recensioner
          </span>
        </div>
      </header>

      <div className="container-prose py-8">
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="text-left py-3 px-4 text-sm font-semibold">Player</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Recensent</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Företag</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Betyg</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Titel</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Verifierad</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Godkänd</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Datum</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Åtgärder</th>
              </tr>
            </thead>
            <tbody>
              {reviews?.map((review: any) => (
                <tr key={review.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900">
                  <td className="py-3 px-4">
                    <Link
                      href={`/players/${review.players?.slug}`}
                      className="text-brand-600 hover:underline"
                    >
                      {review.players?.name}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-sm">{review.reviewer_name}</td>
                  <td className="py-3 px-4 text-sm">{review.reviewer_company || '-'}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{review.rating}/5</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm max-w-xs truncate">{review.title}</td>
                  <td className="py-3 px-4">
                    {review.verified ? (
                      <Check size={16} className="text-green-600" />
                    ) : (
                      <X size={16} className="text-red-600" />
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {review.approved ? (
                      <Check size={16} className="text-green-600" />
                    ) : (
                      <X size={16} className="text-red-600" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {new Date(review.created_at).toLocaleDateString('sv-SE')}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {!review.approved && (
                        <form action={`/api/admin/reviews/${review.id}/approve`} method="POST">
                          <button
                            type="submit"
                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-950 rounded"
                            title="Godkänn"
                          >
                            <Check size={16} />
                          </button>
                        </form>
                      )}
                      <form action={`/api/admin/reviews/${review.id}/delete`} method="POST">
                        <button
                          type="submit"
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded"
                          title="Ta bort"
                        >
                          <Trash2 size={16} />
                        </button>
                      </form>
                      {review.webshop_url && (
                        <a
                          href={review.webshop_url}
                          target="_blank"
                          rel="noopener"
                          className="p-2 text-slate-600 hover:text-brand-600"
                          title="Öppna webshop"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 card">
          <h2 className="text-lg font-semibold mb-4">Lägg till recension manuellt</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Använd detta för att lägga till recensioner från verifierade kunder.
          </p>
          <Link
            href="/admin/reviews/new"
            className="btn-primary inline-flex items-center gap-2"
          >
            Lägg till recension
          </Link>
        </div>
      </div>
    </div>
  );
}
