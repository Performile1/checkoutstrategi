/**
 * Migration script: Move players from lib/players.ts to Supabase
 * Usage: npx tsx scripts/migrate-players.ts
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { players } from '../lib/players';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function migratePlayers() {
  console.log('Starting player migration...');

  for (const player of players) {
    console.log(`Migrating: ${player.name}`);

    const { error } = await supabase.from('players').insert({
      slug: player.slug,
      name: player.name,
      tagline: player.tagline,
      logo_url: player.logoUrl,
      website_url: player.websiteUrl,
      brand_color: player.brandColor,
      category: player.category,
      target_market: player.targetMarket,
      conversion_impact: player.conversionImpact,
      trust_angle: player.trustAngle,
      pros: player.pros,
      cons: player.cons,
      key_features: player.keyFeatures,
      pricing: player.pricing,
      countries: player.countries,
      affiliate_url: player.affiliateUrl,
      description: player.description,
      faq: player.faq,
    });

    if (error) {
      console.error(`Error migrating ${player.name}:`, error.message);
    } else {
      console.log(`✓ ${player.name} migrated successfully`);
    }
  }

  console.log('Migration complete!');
}

migratePlayers().catch(console.error);
