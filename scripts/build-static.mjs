/**
 * Static export orchestrator.
 *
 * Next.js 14 refuses `output: 'export'` when the app contains dynamic Route
 * Handlers (our /api/contact and /api/generate-post). For classic web hosts
 * those endpoints wouldn't run anyway, so we temporarily move /app/api out
 * of the tree, run the export, then restore it.
 *
 * Produces: /out (ready to FTP/SFTP to any static host).
 * Also copies public/.htaccess into /out for Apache-based hosts.
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const API_DIR = path.join(ROOT, 'app', 'api');
const API_BAK = path.join(ROOT, 'app', '_api.bak');
const OUT_DIR = path.join(ROOT, 'out');
const HTACCESS_SRC = path.join(ROOT, 'public', '.htaccess');
const HTACCESS_DST = path.join(OUT_DIR, '.htaccess');

let moved = false;
const cleanup = () => {
  if (moved && fs.existsSync(API_BAK)) {
    fs.renameSync(API_BAK, API_DIR);
    moved = false;
    console.log('[build-static] Restored app/api/');
  }
};
process.on('SIGINT', () => { cleanup(); process.exit(1); });
process.on('SIGTERM', () => { cleanup(); process.exit(1); });

try {
  // Clean previous export.
  if (fs.existsSync(OUT_DIR)) fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.rmSync(path.join(ROOT, '.next'), { recursive: true, force: true });

  // Stash dynamic API routes.
  if (fs.existsSync(API_DIR)) {
    fs.renameSync(API_DIR, API_BAK);
    moved = true;
    console.log('[build-static] Stashed app/api/ -> app/_api.bak');
  }

  // Run the export build with the env flag that flips next.config.mjs.
  execSync('next build', {
    stdio: 'inherit',
    env: { ...process.env, EXPORT: '1' },
  });

  // Copy .htaccess if present (Apache hosts like One.com, Loopia).
  if (fs.existsSync(HTACCESS_SRC) && fs.existsSync(OUT_DIR)) {
    fs.copyFileSync(HTACCESS_SRC, HTACCESS_DST);
    console.log('[build-static] Copied .htaccess -> out/');
  }

  console.log('\n[build-static] ✓ Static bundle ready in /out');
  console.log('              Upload its contents (not the folder itself) to your web host\'s public_html / www folder.');
} finally {
  cleanup();
}
