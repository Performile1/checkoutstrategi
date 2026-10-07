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

let memoryReviews: StoredReview[] | null = null;

function safeWriteReviews(reviewsList: StoredReview[]): void {
  memoryReviews = reviewsList;
  try {
    const dir = path.dirname(REVIEWS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviewsList, null, 2), 'utf8');
  } catch {
    // If process.cwd() is read-only (like Vercel serverless), try /tmp
    try {
      const tmpPath = path.join('/tmp', 'checkout_reviews.json');
      fs.writeFileSync(tmpPath, JSON.stringify(reviewsList, null, 2), 'utf8');
    } catch {
      // Memory cache active
    }
  }
}

function initReviews(): StoredReview[] {
  if (memoryReviews && memoryReviews.length > 0) {
    return memoryReviews;
  }

  // 1. Try reading from REVIEWS_FILE
  try {
    if (fs.existsSync(REVIEWS_FILE)) {
      const content = fs.readFileSync(REVIEWS_FILE, 'utf8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryReviews = parsed;
        return parsed;
      }
    }
  } catch {
    // fallback
  }

  // 2. Try reading from /tmp fallback
  try {
    const tmpPath = path.join('/tmp', 'checkout_reviews.json');
    if (fs.existsSync(tmpPath)) {
      const content = fs.readFileSync(tmpPath, 'utf8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryReviews = parsed;
        return parsed;
      }
    }
  } catch {
    // fallback
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

  safeWriteReviews(seeded);
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
        memoryReviews = data;
        return data;
      }
    } catch {
      // fallback
    }
  }

  return initReviews();
}

export async function approveStoredReview(id: string): Promise<boolean> {
  const reviews = [...initReviews()];
  const index = reviews.findIndex((r) => r.id === id);
  if (index >= 0) {
    reviews[index].approved = true;
    safeWriteReviews(reviews);
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
  safeWriteReviews(filtered);

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
