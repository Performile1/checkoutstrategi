import fs from 'node:fs';
import path from 'node:path';
import { players } from '@/lib/players';
import { getSupabaseClient } from '@/lib/supabase';

const REVIEWS_FILE = path.join(process.cwd(), 'content', 'reviews.json');

export interface StoredReview {
  id: string;
  player_id?: string;
  reviewer_name: string;
  reviewer_company?: string;
  reviewer_email?: string;
  webshop_url?: string;
  rating: number;
  title: string;
  content: string;
  verified: boolean;
  approved: boolean;
  created_at: string;
  players?: {
    name: string;
    slug: string;
  };
}

function initReviews(): StoredReview[] {
  const dir = path.dirname(REVIEWS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  if (fs.existsSync(REVIEWS_FILE)) {
    try {
      const content = fs.readFileSync(REVIEWS_FILE, 'utf8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // fallback
    }
  }

  // Seed with reviews from players
  const seeded: StoredReview[] = [];
  let counter = 1;
  for (const player of players) {
    if (player.reviews && player.reviews.length > 0) {
      for (const r of player.reviews) {
        seeded.push({
          id: `review-${counter++}`,
          player_id: player.slug,
          reviewer_name: r.reviewerName,
          reviewer_company: r.reviewerCompany,
          reviewer_email: 'verifierad@kund.se',
          webshop_url: r.webshopUrl,
          rating: r.rating,
          title: r.title,
          content: r.content,
          verified: true,
          approved: true,
          created_at: new Date(Date.now() - counter * 86400000).toISOString(),
          players: {
            name: player.name,
            slug: player.slug,
          },
        });
      }
    }
  }

  fs.writeFileSync(REVIEWS_FILE, JSON.stringify(seeded, null, 2), 'utf8');
  return seeded;
}

export async function getStoredReviews(): Promise<StoredReview[]> {
  const hasSupabase = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
  );

  if (hasSupabase) {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('reviews')
        .select('*, players(name, slug)')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data;
      }
    } catch {
      // fallback
    }
  }

  return initReviews();
}

export async function approveStoredReview(id: string): Promise<boolean> {
  const reviews = initReviews();
  const index = reviews.findIndex((r) => r.id === id);
  if (index >= 0) {
    reviews[index].approved = true;
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2), 'utf8');
  }

  const hasSupabase = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
  if (hasSupabase) {
    try {
      const supabase = getSupabaseClient(process.env.SUPABASE_SERVICE_ROLE_KEY);
      await supabase.from('reviews').update({ approved: true }).eq('id', id);
    } catch {
      // ignore
    }
  }

  return true;
}

export async function deleteStoredReview(id: string): Promise<boolean> {
  const reviews = initReviews();
  const filtered = reviews.filter((r) => r.id !== id);
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify(filtered, null, 2), 'utf8');

  const hasSupabase = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
  if (hasSupabase) {
    try {
      const supabase = getSupabaseClient(process.env.SUPABASE_SERVICE_ROLE_KEY);
      await supabase.from('reviews').delete().eq('id', id);
    } catch {
      // ignore
    }
  }

  return true;
}
