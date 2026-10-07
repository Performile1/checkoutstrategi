import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
import { getAdminUser } from '@/lib/auth';
import { getSupabaseClient } from '@/lib/supabase';
import { getStoredPlayers, getStoredPlayer } from '@/lib/players-store';
import { getStoredBuilds } from '@/lib/builds-store';
import { getAllPosts } from '@/lib/blog';
import { getStoredReviews } from '@/lib/reviews-store';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const user = await getAdminUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || '';

  const hasSupabaseConfig = Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('placeholder')
  );

  let supabaseStatus: 'connected' | 'not_configured' | 'error' = 'not_configured';
  let supabaseError: string | null = null;
  let supabaseTables: Record<string, { exists: boolean; count?: number; error?: string }> = {};

  if (hasSupabaseConfig) {
    try {
      const client = getSupabaseClient(supabaseServiceKey || supabaseAnonKey);
      
      // Test players
      const { data: pData, error: pErr, count: pCount } = await client
        .from('players')
        .select('*', { count: 'exact', head: false })
        .limit(5);

      if (pErr) {
        supabaseStatus = 'error';
        supabaseError = pErr.message;
        supabaseTables.players = { exists: false, error: pErr.message };
      } else {
        supabaseStatus = 'connected';
        supabaseTables.players = { exists: true, count: pCount ?? pData?.length ?? 0 };
      }

      // Test builds
      const { data: bData, error: bErr, count: bCount } = await client
        .from('builds')
        .select('*', { count: 'exact', head: false })
        .limit(5);
      supabaseTables.builds = bErr
        ? { exists: false, error: bErr.message }
        : { exists: true, count: bCount ?? bData?.length ?? 0 };

      // Test blog_posts
      const { data: bpData, error: bpErr, count: bpCount } = await client
        .from('blog_posts')
        .select('*', { count: 'exact', head: false })
        .limit(5);
      supabaseTables.blog_posts = bpErr
        ? { exists: false, error: bpErr.message }
        : { exists: true, count: bpCount ?? bpData?.length ?? 0 };

      // Test reviews
      const { data: rData, error: rErr, count: rCount } = await client
        .from('reviews')
        .select('*', { count: 'exact', head: false })
        .limit(5);
      supabaseTables.reviews = rErr
        ? { exists: false, error: rErr.message }
        : { exists: true, count: rCount ?? rData?.length ?? 0 };
    } catch (err: any) {
      supabaseStatus = 'error';
      supabaseError = err.message || 'Kunde inte ansluta till Supabase';
    }
  }

  // Local storage inspection
  const playersPath = path.join(process.cwd(), 'content', 'players.json');
  const buildsPath = path.join(process.cwd(), 'content', 'builds.json');
  const tmpPlayersPath = path.join('/tmp', 'checkout_players.json');
  const tmpBuildsPath = path.join('/tmp', 'checkout_builds.json');

  const localFiles = {
    playersJsonExists: fs.existsSync(playersPath),
    buildsJsonExists: fs.existsSync(buildsPath),
    tmpPlayersExists: fs.existsSync(tmpPlayersPath),
    tmpBuildsExists: fs.existsSync(tmpBuildsPath),
  };

  // Inspect Dintero specifically
  const dinteroInStore = await getStoredPlayer('dintero');
  let dinteroInSupabase = false;

  if (supabaseStatus === 'connected') {
    try {
      const client = getSupabaseClient(supabaseServiceKey || supabaseAnonKey);
      const { data } = await client
        .from('players')
        .select('id, slug, name, category, brand_color, conversion_impact')
        .or('slug.eq.dintero,id.eq.dintero')
        .single();
      if (data) dinteroInSupabase = true;
    } catch {
      // ignore
    }
  }

  // Counts across the application
  const [allPlayers, allBuilds, allPosts, allReviews] = await Promise.all([
    getStoredPlayers().catch(() => []),
    getStoredBuilds().catch(() => []),
    Promise.resolve().then(() => getAllPosts()).catch(() => []),
    getStoredReviews().catch(() => []),
  ]);

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    environment: {
      supabaseConfigured: hasSupabaseConfig,
      supabaseUrlProvided: Boolean(supabaseUrl),
      supabaseAnonKeyProvided: Boolean(supabaseAnonKey),
      supabaseServiceKeyProvided: Boolean(supabaseServiceKey),
      databaseUrlProvided: Boolean(databaseUrl),
    },
    supabase: {
      status: supabaseStatus,
      error: supabaseError,
      tables: supabaseTables,
    },
    localStorage: {
      ...localFiles,
      isReadOnlyFilesystem: false,
    },
    dinteroVerification: {
      foundInStore: Boolean(dinteroInStore),
      foundInSupabase: dinteroInSupabase,
      playerDetails: dinteroInStore ? {
        slug: dinteroInStore.slug,
        name: dinteroInStore.name,
        category: dinteroInStore.category,
        brandColor: dinteroInStore.brandColor,
        conversionImpact: dinteroInStore.conversionImpact,
        websiteUrl: dinteroInStore.websiteUrl,
        logoUrl: dinteroInStore.logoUrl,
      } : null,
    },
    counts: {
      players: allPlayers.length,
      builds: allBuilds.length,
      blogPosts: allPosts.length,
      reviews: allReviews.length,
    },
  });
}

export async function POST(request: NextRequest) {
  const user = await getAdminUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { action } = await request.json();
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const client = getSupabaseClient(supabaseServiceKey);

    if (action === 'sync_all_to_supabase') {
      const players = await getStoredPlayers();
      const builds = await getStoredBuilds();

      let syncedPlayers = 0;
      let playerErrors = [];

      for (const p of players) {
        const { error } = await client.from('players').upsert({
          slug: p.slug,
          name: p.name,
          tagline: p.tagline,
          logo_url: p.logoUrl,
          website_url: p.websiteUrl,
          brand_color: p.brandColor,
          category: p.category,
          target_market: p.targetMarket,
          conversion_impact: p.conversionImpact,
          trust_angle: p.trustAngle,
          pros: p.pros,
          cons: p.cons,
          key_features: p.keyFeatures,
          platforms: p.platforms,
          pricing: p.pricing,
          countries: p.countries,
          affiliate_url: p.affiliateUrl,
          description: p.description,
          faq: p.faq,
        }, { onConflict: 'slug' });

        if (!error) syncedPlayers++;
        else playerErrors.push({ slug: p.slug, error: error.message });
      }

      let syncedBuilds = 0;
      for (const b of builds) {
        const { error } = await client.from('builds').upsert({
          id: b.id,
          name: b.name,
          email: b.email,
          company: b.company,
          conversion_score: b.conversion_score,
          aov: b.aov,
          currency: b.currency,
          platform: b.platform,
          layout_order: b.layout_order,
          active_modules: b.active_modules,
          shipping_method: b.shipping_method,
          shipping_cost: b.shipping_cost,
          shipping_eta: b.shipping_eta,
          payment_methods: b.payment_methods,
          return_policy: b.return_policy,
          status: b.status,
          created_at: b.created_at,
        }, { onConflict: 'id' });
        if (!error) syncedBuilds++;
      }

      return NextResponse.json({
        success: true,
        syncedPlayers,
        syncedBuilds,
        playerErrors,
      });
    }

    return NextResponse.json({ error: 'Okänd åtgärd' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Fel vid synk' }, { status: 500 });
  }
}
