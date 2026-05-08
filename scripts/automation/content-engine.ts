/**
 * Checkoutstrategi – AI Content Engine
 * ------------------------------------
 * A three-stage content pipeline:
 *
 *   1. INGEST    – Pull RSS from Nordic + international e-commerce news sources
 *                  and filter by domain-relevant keywords.
 *   2. TRANSFORM – Send each filtered item to GPT-4o as a "Senior Checkout
 *                  Strategist" and get back a full strategic MDX article
 *                  (SEO title, description, tags, TL;DR, H2/H3, 3 tips).
 *   3. PUBLISH   – Write drafts to Supabase blog_posts table so a
 *                  human can review them before flipping them live via admin.
 *
 * Usage:
 *   npm run generate-blog                    # generate up to 3 drafts
 *   npm run generate-blog -- --max 5         # up to 5
 *   npm run generate-blog -- --dry-run       # preview, don't write
 *
 * Requires OPENAI_API_KEY and Supabase credentials in the environment.
 * Falls back to a local template when the key is absent.
 */
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Parser from 'rss-parser';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

interface Source {
  name: string;
  url: string;
  lang: 'sv' | 'en';
}

const SOURCES: Source[] = [
  { name: 'Ehandel.se', url: 'https://www.ehandel.se/feed/', lang: 'sv' },
  { name: 'Breakit', url: 'https://www.breakit.se/rss/feed/artiklar', lang: 'sv' },
  { name: 'PYMNTS', url: 'https://www.pymnts.com/feed/', lang: 'en' },
  { name: 'Digital Commerce 360', url: 'https://www.digitalcommerce360.com/feed/', lang: 'en' },
  { name: 'Finextra', url: 'https://www.finextra.com/rss/headlines.aspx', lang: 'en' },
];

const KEYWORDS = [
  'checkout', 'kassa', 'betalning', 'payment', 'payments',
  'e-handel', 'ehandel', 'e-commerce', 'ecommerce',
  'konvertering', 'conversion', 'cro',
  'frakt', 'shipping', 'logistik', 'logistics', 'delivery',
  'klarna', 'walley', 'qliro', 'kustom', 'ingrid', 'nshift',
  'bnpl', 'buy now pay later', 'one-click', 'wallet',
];

const SYSTEM_PROMPT =
  'You are a Senior Checkout Strategist and CRO expert for Swedish e-commerce. ' +
  'Rewrite news items into strategic, non-generic blog posts for checkoutstrategi.se. ' +
  'Write in Swedish in a professional but accessible tone. Always ground advice in ' +
  'checkout, conversion, BNPL and delivery-experience angles. Reference relevant ' +
  'Nordic players (Klarna, Walley, Qliro, Kustom, Ingrid, nShift) when natural. ' +
  'Output must be VALID JSON only – no prose around it.';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const STATE_FILE = path.join(ROOT, 'scripts', 'automation', '.seen.json');

const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  : null;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface NewsItem {
  source: string;
  lang: 'sv' | 'en';
  title: string;
  url: string;
  summary: string;
  isoDate?: string;
}

interface GeneratedArticle {
  meta_title: string;
  meta_description: string;
  slug: string;
  tags: string[];
  tldr: string;
  unsplash_keyword: string;
  body_markdown: string; // full markdown body with H2/H3, 3 concrete tips, etc.
}

// ---------------------------------------------------------------------------
// 1. INGEST
// ---------------------------------------------------------------------------

async function ingest(): Promise<NewsItem[]> {
  const parser = new Parser({ timeout: 10_000 });
  const results: NewsItem[] = [];

  await Promise.all(
    SOURCES.map(async (src) => {
      try {
        const feed = await parser.parseURL(src.url);
        for (const entry of feed.items.slice(0, 15)) {
          if (!entry.title || !entry.link) continue;
          const summary = stripHtml(entry.contentSnippet || entry.content || entry.summary || '').slice(0, 700);
          results.push({
            source: src.name,
            lang: src.lang,
            title: entry.title.trim(),
            url: entry.link,
            summary,
            isoDate: entry.isoDate,
          });
        }
      } catch (err) {
        console.warn(`[ingest] ${src.name} failed:`, (err as Error).message);
      }
    })
  );

  return results;
}

function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function matchesKeywords(item: NewsItem): boolean {
  const haystack = `${item.title} ${item.summary}`.toLowerCase();
  return KEYWORDS.some((k) => haystack.includes(k));
}

// ---------------------------------------------------------------------------
// 2. TRANSFORM
// ---------------------------------------------------------------------------

async function transform(item: NewsItem, openai: OpenAI | null): Promise<GeneratedArticle> {
  const userPrompt = [
    `Analysera följande nyhet och skriv en ny artikel på svenska för checkoutstrategi.se.`,
    `Fokusera på hur nyheten påverkar svenska e-handlares konvertering i kassan.`,
    ``,
    `KÄLLA: ${item.source}`,
    `URL: ${item.url}`,
    `RUBRIK: ${item.title}`,
    `SAMMANFATTNING: ${item.summary || '(saknas – extrapolera från rubriken)'}`,
    ``,
    `Returnera STRIKT följande JSON-schema (inget annat):`,
    `{`,
    `  "meta_title": "<=60 tecken, SEO-optimerad",`,
    `  "meta_description": "<=155 tecken, klickdrivande",`,
    `  "slug": "kebab-case, max 70 tecken, utan svenska tecken",`,
    `  "tags": ["3-6 relevanta taggar"],`,
    `  "tldr": "2-3 meningar. Börja med 'TL;DR:'",`,
    `  "unsplash_keyword": "1-3 engelska ord som söker fram en passande header-bild",`,
    `  "body_markdown": "Full artikelkropp i Markdown (600-900 ord). Inled med TL;DR-blockquote, sedan H2/H3-struktur, avsluta med en sektion '## 3 konkreta tips för handlare' med numrerad lista."`,
    `}`,
  ].join('\n');

  if (openai) {
    try {
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o',
        temperature: 0.5,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
      });
      const raw = completion.choices[0]?.message?.content;
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<GeneratedArticle>;
        return normalizeArticle(parsed, item);
      }
    } catch (err) {
      console.warn('[transform] OpenAI failed, falling back to template:', (err as Error).message);
    }
  }

  return fallbackArticle(item);
}

function normalizeArticle(p: Partial<GeneratedArticle>, item: NewsItem): GeneratedArticle {
  return {
    meta_title: (p.meta_title || item.title).slice(0, 70),
    meta_description: (p.meta_description || item.summary || item.title).slice(0, 160),
    slug: slugify(p.slug || item.title).slice(0, 70),
    tags: Array.isArray(p.tags) && p.tags.length ? p.tags.slice(0, 8) : ['checkout', 'news'],
    tldr: p.tldr || `TL;DR: ${item.title}.`,
    unsplash_keyword: p.unsplash_keyword || 'ecommerce checkout',
    body_markdown: p.body_markdown || fallbackBody(item),
  };
}

function fallbackArticle(item: NewsItem): GeneratedArticle {
  return {
    meta_title: item.title.slice(0, 70),
    meta_description: (item.summary || item.title).slice(0, 160),
    slug: slugify(item.title).slice(0, 70),
    tags: ['checkout', 'news', 'ai-draft'],
    tldr: `TL;DR: ${item.title}. Kort analys av hur detta påverkar svenska e-handlares kassa.`,
    unsplash_keyword: 'ecommerce checkout',
    body_markdown: fallbackBody(item),
  };
}

function fallbackBody(item: NewsItem): string {
  return [
    `> **TL;DR:** ${item.title}. Analys av hur detta påverkar kassaflödet för svenska e-handlare.`,
    ``,
    `## Vad har hänt?`,
    ``,
    item.summary || `Enligt ${item.source} rapporteras att: ${item.title}.`,
    ``,
    `Källa: [${item.source}](${item.url})`,
    ``,
    `## Vad betyder detta för svenska e-handlare?`,
    ``,
    `Nyheten berör direkt eller indirekt hur besökare beter sig i kassan. Relevanta levers:`,
    ``,
    `- **BNPL-mix:** Klarna, Walley och Qliro kan påverkas olika beroende på signal.`,
    `- **Leverans:** Ingrid och nShift blir extra relevanta när förväntningarna skiftar.`,
    `- **UI-kontroll:** Kustom ger utrymme att anpassa UX snabbt.`,
    ``,
    `## 3 konkreta tips för handlare`,
    ``,
    `1. **Audit din kassa** mot vår [jämförelsetabell](/comparison) denna vecka.`,
    `2. **A/B-testa leveransvalet** – flytta upp det i flödet och mät konvertering.`,
    `3. **Lägg på post-purchase upsell** (Walley Engage eller motsvarande) för intäkt utan friktion.`,
  ].join('\n');
}

// ---------------------------------------------------------------------------
// 3. PUBLISH
// ---------------------------------------------------------------------------

async function publish(item: NewsItem, article: GeneratedArticle): Promise<string> {
  if (!supabase) {
    console.warn('[publish] Supabase not configured, skipping database write');
    return 'skipped';
  }

  const unsplashUrl = `https://source.unsplash.com/1600x900/?${encodeURIComponent(article.unsplash_keyword)}`;

  // Ensure the body opens with a TL;DR blockquote even if the model forgot.
  const body = article.body_markdown.trim();
  const bodyHasTldr = /^>\s*\*\*tl;dr/i.test(body);
  const finalBody = bodyHasTldr ? body : `> **${article.tldr.replace(/^TL;DR:?\s*/i, 'TL;DR:** ')}\n\n${body}`;

  // The model often includes an H1 or no H1; enforce a top-level H1 = meta_title
  const withH1 = /^#\s+/m.test(finalBody) ? finalBody : `# ${article.meta_title}\n\n${finalBody}`;

  const { error } = await supabase.from('blog_posts').insert({
    slug: article.slug,
    title: article.meta_title,
    description: article.meta_description,
    content: withH1,
    cover_url: unsplashUrl,
    unsplash_keyword: article.unsplash_keyword,
    author: 'AI-analytikern',
    tags: article.tags,
    source: item.source,
    source_url: item.url,
    draft: true,
  });

  if (error) {
    throw new Error(`Failed to publish to Supabase: ${error.message}`);
  }

  return article.slug;
}

function json(s: string): string {
  return JSON.stringify(s);
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[åä]/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[éè]/g, 'e')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// ---------------------------------------------------------------------------
// State (de-dup across runs)
// ---------------------------------------------------------------------------

function loadSeen(): Set<string> {
  try {
    return new Set(JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')));
  } catch {
    return new Set();
  }
}

function saveSeen(seen: Set<string>): void {
  fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
  fs.writeFileSync(STATE_FILE, JSON.stringify([...seen].sort(), null, 2), 'utf8');
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

interface Flags {
  max: number;
  dryRun: boolean;
}

function parseFlags(argv: string[]): Flags {
  const flags: Flags = { max: 3, dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--max' && argv[i + 1]) { flags.max = parseInt(argv[++i], 10) || 3; }
    else if (a === '--dry-run') { flags.dryRun = true; }
  }
  return flags;
}

async function main(): Promise<void> {
  const flags = parseFlags(process.argv.slice(2));
  const openai = process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

  if (!openai) {
    console.warn('[content-engine] OPENAI_API_KEY not set – using fallback template.');
  }

  console.log('[1/3] Ingesting feeds...');
  const items = await ingest();
  console.log(`      -> ${items.length} total items`);

  const relevant = items.filter(matchesKeywords);
  console.log(`      -> ${relevant.length} match keyword filter`);

  const seen = loadSeen();
  const fresh = relevant.filter((i) => !seen.has(i.url));
  console.log(`      -> ${fresh.length} new since last run`);

  const batch = fresh.slice(0, flags.max);
  if (batch.length === 0) {
    console.log('No new items to process. Exiting.');
    return;
  }

  console.log(`[2/3] Transforming ${batch.length} item(s) via ${openai ? 'GPT-4o' : 'fallback template'}...`);
  const written: string[] = [];
  for (const item of batch) {
    const article = await transform(item, openai);
    if (flags.dryRun) {
      console.log(`  [dry-run] ${item.title}`);
      console.log(`           meta_title: ${article.meta_title}`);
      console.log(`           slug:       ${article.slug}`);
      console.log(`           tldr:       ${article.tldr}`);
    } else {
      const slug = await publish(item, article);
      seen.add(item.url);
      written.push(slug);
      console.log(`  ✓ ${slug}`);
    }
  }

  if (!flags.dryRun) {
    saveSeen(seen);
    console.log(`[3/3] Wrote ${written.length} draft(s) to Supabase:`);
    written.forEach((w) => console.log(`      - ${w}`));
    console.log('');
    console.log('Review the drafts in the admin panel, then publish them there.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
