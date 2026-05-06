/**
 * Promote reviewed drafts from *.draft.mdx -> *.mdx.
 *
 * Usage:
 *   npm run publish-drafts               # interactive list + confirm all
 *   npm run publish-drafts -- --yes      # skip confirmation
 *   npm run publish-drafts -- <slug>     # only a single draft (filename contains <slug>)
 *
 * Also flips `draft: true` -> `draft: false` in the frontmatter and stamps
 * `publishedAt` with the current ISO timestamp.
 */
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const BLOG_DIR = path.join(ROOT, 'content', 'blog');

interface Flags { yes: boolean; filter?: string }

function parseFlags(argv: string[]): Flags {
  const f: Flags = { yes: false };
  for (const a of argv) {
    if (a === '--yes' || a === '-y') f.yes = true;
    else if (!a.startsWith('-')) f.filter = a;
  }
  return f;
}

function listDrafts(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.draft.mdx'))
    .sort();
}

function promote(filename: string): string {
  const src = path.join(BLOG_DIR, filename);
  const dst = path.join(BLOG_DIR, filename.replace(/\.draft\.mdx$/, '.mdx'));
  let content = fs.readFileSync(src, 'utf8');
  content = content.replace(/^draft:\s*true\s*$/m, 'draft: false');
  if (!/^publishedAt:/m.test(content)) {
    content = content.replace(/^---\s*$/m, `publishedAt: "${new Date().toISOString()}"\n---`);
  }
  fs.writeFileSync(dst, content, 'utf8');
  fs.unlinkSync(src);
  return dst;
}

async function confirm(question: string): Promise<boolean> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((res) => rl.question(`${question} [y/N] `, (a) => { rl.close(); res(/^y(es)?$/i.test(a.trim())); }));
}

async function main(): Promise<void> {
  const flags = parseFlags(process.argv.slice(2));
  let drafts = listDrafts();
  if (flags.filter) drafts = drafts.filter((d) => d.includes(flags.filter!));

  if (drafts.length === 0) {
    console.log('No drafts to publish.');
    return;
  }

  console.log(`Found ${drafts.length} draft(s):`);
  drafts.forEach((d) => console.log(`  - ${d}`));

  if (!flags.yes) {
    const ok = await confirm('Promote all of the above to live posts?');
    if (!ok) { console.log('Aborted.'); return; }
  }

  for (const d of drafts) {
    const out = promote(d);
    console.log(`  ✓ ${path.basename(out)}`);
  }
  console.log(`Published ${drafts.length} post(s).`);
}

main().catch((err) => { console.error(err); process.exit(1); });
