import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const { Client } = pg;

async function updateCategoryConstraint() {
  console.log('Updating category constraint in Supabase...');

  const client = new Client({
    connectionString: process.env.SUPABASE_DB_URL || process.env.DATABASE_URL,
  });

  try {
    await client.connect();

    // Drop old constraint
    await client.query('ALTER TABLE players DROP CONSTRAINT IF EXISTS players_category_check;');
    console.log('✓ Dropped old constraint');

    // Add new constraint
    await client.query("ALTER TABLE players ADD CONSTRAINT players_category_check CHECK (category IN ('Checkout', 'Betallösning', 'Plugin', 'Transportör', 'E-handelsplattform'));");
    console.log('✓ Added new constraint');

    console.log('✓ Category constraint updated successfully');
  } catch (error) {
    console.error('Error updating constraint:', error);
  } finally {
    await client.end();
  }
}

updateCategoryConstraint();
