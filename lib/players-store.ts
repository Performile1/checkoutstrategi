import fs from 'node:fs';
import path from 'node:path';
import { players as staticPlayers, Player } from '@/lib/players';
import { getSupabaseClient } from '@/lib/supabase';

const PLAYERS_FILE = path.join(process.cwd(), 'content', 'players.json');

export interface StoredPlayer extends Player {
  id: string;
  target_market?: string;
  conversion_impact?: number;
  logo_url?: string;
  website_url?: string;
  brand_color?: string;
  key_features?: string[];
  affiliate_url?: string;
  created_at?: string;
  updated_at?: string;
}

function normalizePlayer(p: any): StoredPlayer {
  const id = p.id || p.slug;
  const targetMarket = p.targetMarket || p.target_market || 'B2C';
  const conversionImpact = p.conversionImpact ?? p.conversion_impact ?? 7;
  const logoUrl = p.logoUrl || p.logo_url || '/logos/klarna.png';
  const websiteUrl = p.websiteUrl || p.website_url || '';
  const brandColor = p.brandColor || p.brand_color || 'bg-brand-500';
  const keyFeatures = p.keyFeatures || p.key_features || [];
  const affiliateUrl = p.affiliateUrl || p.affiliate_url || '';

  return {
    ...p,
    id,
    slug: p.slug || id,
    name: p.name || 'Namnlös aktör',
    tagline: p.tagline || '',
    logoUrl,
    logo_url: logoUrl,
    websiteUrl,
    website_url: websiteUrl,
    brandColor,
    brand_color: brandColor,
    category: p.category || 'Checkout',
    targetMarket,
    target_market: targetMarket,
    conversionImpact,
    conversion_impact: conversionImpact,
    marketImpact: p.marketImpact || { se: 5, no: 5, dk: 5, fi: 5 },
    trustAngle: p.trustAngle || p.trust_angle || '',
    pros: p.pros || [],
    cons: p.cons || [],
    keyFeatures,
    key_features: keyFeatures,
    platforms: p.platforms || [],
    pricing: p.pricing || '',
    countries: p.countries || ['SE'],
    affiliateUrl,
    affiliate_url: affiliateUrl,
    description: p.description || '',
    faq: p.faq || [],
    reviews: p.reviews || [],
  };
}

let memoryPlayers: StoredPlayer[] | null = null;

function safeWritePlayers(playersList: StoredPlayer[]): void {
  memoryPlayers = playersList;
  try {
    const dir = path.dirname(PLAYERS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(PLAYERS_FILE, JSON.stringify(playersList, null, 2), 'utf8');
  } catch {
    // If process.cwd() is read-only (like Vercel serverless), try /tmp
    try {
      const tmpPath = path.join('/tmp', 'checkout_players.json');
      fs.writeFileSync(tmpPath, JSON.stringify(playersList, null, 2), 'utf8');
    } catch {
      // Memory cache is active
    }
  }
}

function initPlayers(): StoredPlayer[] {
  if (memoryPlayers && memoryPlayers.length > 0) {
    return memoryPlayers;
  }

  // 1. Try reading from project PLAYERS_FILE
  try {
    if (fs.existsSync(PLAYERS_FILE)) {
      const content = fs.readFileSync(PLAYERS_FILE, 'utf8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryPlayers = parsed.map(normalizePlayer);
        return memoryPlayers;
      }
    }
  } catch {
    // continue to /tmp
  }

  // 2. Try reading from /tmp fallback
  try {
    const tmpPath = path.join('/tmp', 'checkout_players.json');
    if (fs.existsSync(tmpPath)) {
      const content = fs.readFileSync(tmpPath, 'utf8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryPlayers = parsed.map(normalizePlayer);
        return memoryPlayers;
      }
    }
  } catch {
    // continue to static
  }

  // 3. Seed with static players
  const seeded = staticPlayers.map(normalizePlayer);
  safeWritePlayers(seeded);
  return seeded;
}

export async function getStoredPlayers(): Promise<StoredPlayer[]> {
  // If Supabase is connected, try to query Supabase first
  const hasSupabase = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
  );

  if (hasSupabase) {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.from('players').select('*').order('name');
      if (!error && data && data.length > 0) {
        const mapped = data.map(normalizePlayer);
        memoryPlayers = mapped;
        return mapped;
      }
    } catch {
      // fallback to local/memory store
    }
  }

  return initPlayers();
}

export async function getStoredPlayer(idOrSlug: string): Promise<StoredPlayer | undefined> {
  const players = await getStoredPlayers();
  return players.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
}

export async function saveStoredPlayer(playerData: any): Promise<StoredPlayer> {
  const normalized = normalizePlayer(playerData);
  const players = [...initPlayers()];
  const index = players.findIndex((p) => p.id === normalized.id || p.slug === normalized.slug);

  if (index >= 0) {
    players[index] = { ...players[index], ...normalized, updated_at: new Date().toISOString() };
  } else {
    players.push({ ...normalized, created_at: new Date().toISOString() });
  }

  safeWritePlayers(players);

  // Also sync to Supabase if connected
  const hasSupabase = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
  if (hasSupabase) {
    try {
      const supabase = getSupabaseClient(process.env.SUPABASE_SERVICE_ROLE_KEY);
      await supabase.from('players').upsert({
        slug: normalized.slug,
        name: normalized.name,
        tagline: normalized.tagline,
        logo_url: normalized.logoUrl,
        website_url: normalized.websiteUrl,
        brand_color: normalized.brandColor,
        category: normalized.category,
        target_market: normalized.targetMarket,
        conversion_impact: normalized.conversionImpact,
        trust_angle: normalized.trustAngle,
        pros: normalized.pros,
        cons: normalized.cons,
        key_features: normalized.keyFeatures,
        platforms: normalized.platforms,
        pricing: normalized.pricing,
        countries: normalized.countries,
        affiliate_url: normalized.affiliateUrl,
        description: normalized.description,
        faq: normalized.faq,
      }, { onConflict: 'slug' });
    } catch {
      // ignore Supabase sync error
    }
  }

  return normalized;
}

export async function deleteStoredPlayer(idOrSlug: string): Promise<boolean> {
  const players = initPlayers();
  const filtered = players.filter((p) => p.id !== idOrSlug && p.slug !== idOrSlug);
  safeWritePlayers(filtered);

  const hasSupabase = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
  if (hasSupabase) {
    try {
      const supabase = getSupabaseClient(process.env.SUPABASE_SERVICE_ROLE_KEY);
      await supabase.from('players').delete().or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`);
    } catch {
      // ignore
    }
  }

  return true;
}
