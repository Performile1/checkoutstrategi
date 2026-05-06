'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, CheckCircle2, AlertCircle } from 'lucide-react';
import { getPlayer, players } from '@/lib/players';

export default function ReviewSubmissionPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const player = getPlayer(params.slug);
  
  const [formData, setFormData] = useState({
    reviewerName: '',
    reviewerCompany: '',
    reviewerEmail: '',
    webshopUrl: '',
    rating: 5,
    title: '',
    content: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  if (!player) {
    return <div className="container-prose py-12">Player not found</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // TODO: Implement actual API call to submit review
      // For now, simulate submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitSuccess(true);
      
      // In production, this would send a verification email
      // The email would contain a link to verify the review
      // e.g., /players/${player.slug}/review/verify?token=xxx
      
    } catch (error) {
      setSubmitError('Ett fel uppstod vid skickande av recension. Försök igen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="container-prose py-12">
        <div className="max-w-2xl mx-auto">
          <div className="card text-center py-12">
            <CheckCircle2 size={64} className="mx-auto text-green-600 mb-6" />
            <h1 className="text-2xl font-bold mb-4">Recension skickad!</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Vi har skickat ett verifieringsmail till {formData.reviewerEmail}. 
              Klicka på länken i mailet för att verifiera din recension.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Detta förhindrar falska recensioner och säkerställer att recensioner kommer från riktiga företag.
            </p>
            <button
              onClick={() => router.push(`/players/${player.slug}`)}
              className="btn-primary mt-8"
            >
              Tillbaka till {player.name}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-prose py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Lämna en recension för {player.name}</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Dela din erfarenhet av {player.name} med andra e-handlare.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card">
          {submitError && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 dark:text-red-400 mt-0.5" />
              <p className="text-sm text-red-800 dark:text-red-300">{submitError}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Betyg *
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating })}
                    className={`p-2 rounded-lg transition-colors ${
                      formData.rating >= rating
                        ? 'text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
                        : 'text-slate-300 hover:text-yellow-400'
                    }`}
                  >
                    <Star size={24} className={formData.rating >= rating ? 'fill-current' : ''} />
                  </button>
                ))}
              </div>
            </div>

            {/* Reviewer Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Ditt namn *
              </label>
              <input
                type="text"
                required
                value={formData.reviewerName}
                onChange={(e) => setFormData({ ...formData, reviewerName: e.target.value })}
                className="w-full p-3 border border-slate-300 rounded-lg dark:border-slate-600 dark:bg-slate-700"
                placeholder="Förnamn Efternamn"
              />
            </div>

            {/* Reviewer Company */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Företagsnamn *
              </label>
              <input
                type="text"
                required
                value={formData.reviewerCompany}
                onChange={(e) => setFormData({ ...formData, reviewerCompany: e.target.value })}
                className="w-full p-3 border border-slate-300 rounded-lg dark:border-slate-600 dark:bg-slate-700"
                placeholder="Ditt företagsnamn"
              />
            </div>

            {/* Reviewer Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                E-post (företagsdomän) *
              </label>
              <input
                type="email"
                required
                value={formData.reviewerEmail}
                onChange={(e) => setFormData({ ...formData, reviewerEmail: e.target.value })}
                className="w-full p-3 border border-slate-300 rounded-lg dark:border-slate-600 dark:bg-slate-700"
                placeholder="namn@företag.se"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Vi skickar ett verifieringsmail till denna adress för att bekräfta att du representerar företaget.
              </p>
            </div>

            {/* Webshop URL */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Länk till webshop (valfritt)
              </label>
              <input
                type="url"
                value={formData.webshopUrl}
                onChange={(e) => setFormData({ ...formData, webshopUrl: e.target.value })}
                className="w-full p-3 border border-slate-300 rounded-lg dark:border-slate-600 dark:bg-slate-700"
                placeholder="https://din-webshop.se"
              />
            </div>

            {/* Review Title */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Rubrik *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-3 border border-slate-300 rounded-lg dark:border-slate-600 dark:bg-slate-700"
                placeholder="Sammanfattning av din erfarenhet"
                maxLength={100}
              />
            </div>

            {/* Review Content */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Recension *
              </label>
              <textarea
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full p-3 border border-slate-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 min-h-[150px]"
                placeholder="Berätta om din erfarenhet av {player.name}..."
                minLength={50}
                maxLength={1000}
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Minst 50 tecken, max 1000 tecken
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex-1"
              >
                {isSubmitting ? 'Skickar...' : 'Skicka recension'}
              </button>
              <button
                type="button"
                onClick={() => router.push(`/players/${player.slug}`)}
                className="btn-secondary"
              >
                Avbryt
              </button>
            </div>
          </div>
        </form>

        <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <h3 className="font-semibold mb-2">Om verifiering</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            För att säkerställa att recensioner är äkta skickar vi ett verifieringsmail till din företagsadress. 
            Klicka på länken i mailet för att publicera din recension. Detta förhindrar falska recensioner.
          </p>
        </div>
      </div>
    </div>
  );
}
