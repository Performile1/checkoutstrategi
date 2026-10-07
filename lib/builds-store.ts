import fs from 'node:fs';
import path from 'node:path';
import { getSupabaseClient } from '@/lib/supabase';

const BUILDS_FILE = path.join(process.cwd(), 'content', 'builds.json');

export interface CheckoutBuild {
  id: string;
  name: string;
  email: string;
  company?: string;
  conversion_score: number;
  aov: number;
  currency: string;
  platform?: string;
  layout_order: string[];
  active_modules: string[];
  shipping_method?: string;
  shipping_cost?: string;
  shipping_eta?: string;
  payment_methods: string[];
  return_policy?: {
    window?: number;
    cost?: string;
    method?: string;
    allow_exchange?: boolean;
  };
  notes?: string;
  status: 'downloaded' | 'pending' | 'contacted' | 'archived';
  created_at: string;
  updated_at?: string;
}

let memoryBuilds: CheckoutBuild[] | null = null;

function safeWriteBuilds(buildsList: CheckoutBuild[]): void {
  memoryBuilds = buildsList;
  // 1. Try local content/builds.json
  try {
    const dir = path.dirname(BUILDS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(BUILDS_FILE, JSON.stringify(buildsList, null, 2), 'utf8');
  } catch {
    // Read-only filesystem in serverless environments
  }

  // 2. Always write to /tmp cache
  try {
    const tmpPath = path.join('/tmp', 'checkout_builds.json');
    fs.writeFileSync(tmpPath, JSON.stringify(buildsList, null, 2), 'utf8');
  } catch {
    // Memory remains active
  }
}

function initBuilds(): CheckoutBuild[] {
  if (memoryBuilds && memoryBuilds.length > 0) {
    return memoryBuilds;
  }

  const map = new Map<string, CheckoutBuild>();

  // 1. Read from content/builds.json
  try {
    if (fs.existsSync(BUILDS_FILE)) {
      const raw = fs.readFileSync(BUILDS_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        for (const b of parsed) {
          if (b && b.id) map.set(b.id, b);
        }
      }
    }
  } catch {
    // continue
  }

  // 2. Read from /tmp fallback
  try {
    const tmpPath = path.join('/tmp', 'checkout_builds.json');
    if (fs.existsSync(tmpPath)) {
      const raw = fs.readFileSync(tmpPath, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        for (const b of parsed) {
          if (b && b.id) map.set(b.id, b);
        }
      }
    }
  } catch {
    // continue
  }

  // 3. If completely empty, seed a sample demo build
  if (map.size === 0) {
    const sampleBuild: CheckoutBuild = {
      id: 'build-demo-1',
      name: 'Carl Lindqvist',
      email: 'carl@nordicfashion.se',
      company: 'Nordic Fashion Group',
      conversion_score: 44.5,
      aov: 850,
      currency: 'SEK',
      platform: 'shopify',
      layout_order: ['summary', 'shipping', 'payment', 'security', 'trustBadge'],
      active_modules: ['freeShipping', 'stockNotice', 'expressCheckout', 'klarnaOnSite', 'trustBadge'],
      shipping_method: 'Instabox Paketskåp',
      shipping_cost: 'free',
      shipping_eta: '1-2 arbetsdagar',
      payment_methods: ['klarna', 'swish', 'card'],
      return_policy: {
        window: 30,
        cost: 'free',
        method: 'qr',
        allow_exchange: true,
      },
      status: 'downloaded',
      created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    };
    map.set(sampleBuild.id, sampleBuild);
    safeWriteBuilds(Array.from(map.values()));
  }

  const result = Array.from(map.values());
  memoryBuilds = result;
  return result;
}

export async function getStoredBuilds(): Promise<CheckoutBuild[]> {
  const hasSupabase = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
  );

  if (hasSupabase) {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.from('builds').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        // Merge Supabase records with local records
        const local = initBuilds();
        const map = new Map<string, CheckoutBuild>();
        for (const b of local) map.set(b.id, b);
        for (const b of data) {
          map.set(b.id, {
            ...b,
            conversion_score: Number(b.conversion_score || b.conversionScore || 0),
            aov: Number(b.aov || 0),
            layout_order: Array.isArray(b.layout_order) ? b.layout_order : [],
            active_modules: Array.isArray(b.active_modules) ? b.active_modules : [],
            payment_methods: Array.isArray(b.payment_methods) ? b.payment_methods : [],
          });
        }
        const merged = Array.from(map.values()).sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        memoryBuilds = merged;
        return merged;
      }
    } catch {
      // fallback
    }
  }

  const local = initBuilds();
  return local.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function getStoredBuild(id: string): Promise<CheckoutBuild | undefined> {
  const builds = await getStoredBuilds();
  return builds.find((b) => b.id === id);
}

export async function saveStoredBuild(buildData: Partial<CheckoutBuild>): Promise<CheckoutBuild> {
  const currentBuilds = await getStoredBuilds();
  const id = buildData.id || `build-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const newBuild: CheckoutBuild = {
    id,
    name: buildData.name || 'Anonym Användare',
    email: buildData.email || 'okänd@epost.se',
    company: buildData.company || '',
    conversion_score: Number(buildData.conversion_score || 35),
    aov: Number(buildData.aov || 750),
    currency: buildData.currency || 'SEK',
    platform: buildData.platform || 'shopify',
    layout_order: buildData.layout_order || ['summary', 'shipping', 'payment'],
    active_modules: buildData.active_modules || [],
    shipping_method: buildData.shipping_method || 'Standardfrakt',
    shipping_cost: buildData.shipping_cost || '0 kr',
    shipping_eta: buildData.shipping_eta || '1-3 dagar',
    payment_methods: buildData.payment_methods || ['klarna', 'swish'],
    return_policy: buildData.return_policy || { window: 30, cost: 'free', method: 'qr', allow_exchange: true },
    notes: buildData.notes || '',
    status: buildData.status || 'downloaded',
    created_at: buildData.created_at || now,
    updated_at: now,
  };

  const builds = [...currentBuilds];
  const index = builds.findIndex((b) => b.id === id);
  if (index >= 0) {
    builds[index] = { ...builds[index], ...newBuild };
  } else {
    builds.unshift(newBuild);
  }

  safeWriteBuilds(builds);

  // Sync to Supabase if connected
  const hasSupabase = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );

  if (hasSupabase) {
    try {
      const supabase = getSupabaseClient(process.env.SUPABASE_SERVICE_ROLE_KEY);
      await supabase.from('builds').upsert({
        id: newBuild.id,
        name: newBuild.name,
        email: newBuild.email,
        company: newBuild.company,
        conversion_score: newBuild.conversion_score,
        aov: newBuild.aov,
        currency: newBuild.currency,
        platform: newBuild.platform,
        layout_order: newBuild.layout_order,
        active_modules: newBuild.active_modules,
        shipping_method: newBuild.shipping_method,
        shipping_cost: newBuild.shipping_cost,
        shipping_eta: newBuild.shipping_eta,
        payment_methods: newBuild.payment_methods,
        return_policy: newBuild.return_policy,
        status: newBuild.status,
        created_at: newBuild.created_at,
      }, { onConflict: 'id' });
    } catch {
      // Supabase sync failure handled gracefully
    }
  }

  return newBuild;
}

export async function deleteStoredBuild(id: string): Promise<boolean> {
  const currentBuilds = await getStoredBuilds();
  const filtered = currentBuilds.filter((b) => b.id !== id);
  safeWriteBuilds(filtered);

  const hasSupabase = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );

  if (hasSupabase) {
    try {
      const supabase = getSupabaseClient(process.env.SUPABASE_SERVICE_ROLE_KEY);
      await supabase.from('builds').delete().eq('id', id);
    } catch {
      // ignore
    }
  }

  return true;
}
