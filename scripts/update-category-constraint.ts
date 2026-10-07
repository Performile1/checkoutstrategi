import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const { Pool } = pg;

let db: any;
try {
  if (!process.env.SUPABASE_DB_URL && !process.env.DATABASE_URL) {
    throw new Error('No DATABASE_URL configured');
  }
  db = new Pool({ connectionString: process.env.SUPABASE_DB_URL || process.env.DATABASE_URL });
} catch {
  console.warn('DB not connected — mock active');
  db = {
    query: async () => ({ rows: [] }),
    connect: async () => ({ query: async () => ({ rows: [] }), release: () => {} }),
    end: async () => {},
  };
}

export { db };

async function updateCategoryConstraint() {
  console.log('Updating category constraint in Supabase...');

  try {
    // Drop old constraint
    await db.query('ALTER TABLE players DROP CONSTRAINT IF EXISTS players_category_check;');
    console.log('✓ Dropped old constraint');

    // Add new constraint
    await db.query("ALTER TABLE players ADD CONSTRAINT players_category_check CHECK (category IN ('Checkout', 'Betallösning', 'Plugin', 'Transportör', 'E-handelsplattform'));");
    console.log('✓ Added new constraint');

    console.log('✓ Category constraint updated successfully');
  } catch (error) {
    console.error('Error updating constraint:', error);
  } finally {
    if (db.end) await db.end();
  }
}

updateCategoryConstraint();
