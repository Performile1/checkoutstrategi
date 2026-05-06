# Checkoutstrategi.se

High-authority affiliate/media site for the Swedish checkout & e-commerce fintech niche. Built as a 3-layer asset: **Trust Layer** (player pages), **Traffic Engine** (AI blog), **Exit Strategy** (data-driven, sellable).

## Stack

- **Next.js 14** App Router + TypeScript
- **Tailwind CSS** (Fintech Modern: slate / indigo / white, dark mode via `next-themes`)
- **MDX** blog via `next-mdx-remote` + `gray-matter`
- **Framer Motion** for micro-interactions
- **Lucide React** icons
- **Vercel Analytics** pre-wired

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in what you need (optional)
npm run dev
```

Open http://localhost:3000.

## Project structure

```
app/
  layout.tsx              Root layout + metadata + JSON-LD (Organization)
  page.tsx                Homepage (hero, players preview, news feed, CTA)
  players/                Dynamic player analysis pages (Trust Layer)
  comparison/             Side-by-side comparison table
  blog/                   MDX blog (listing + [slug])
  guides/                 Strategy guides
  contact/                Lead magnet form (Formspree or Resend)
  api/
    generate-post/        POST with x-generate-token to draft a post via OpenAI
    contact/              Fallback contact handler (Resend or stdout)
  sitemap.ts  robots.ts   SEO
  rss.xml/route.ts        RSS feed for blog

components/               Header, Footer, ThemeProvider, PlayerCard,
                          ComparisonTable, NewsFeed

content/blog/             MDX posts (auto-generated or handwritten)

lib/
  players.ts              Player schema + data (Klarna, Walley, Kustom,
                          Qliro, Ingrid, nShift, Svea)
  blog.ts                 MDX reader (gray-matter)
  site.ts                 Site config

scripts/
  generate_post.py        Weekly AI blog pipeline (RSS -> OpenAI -> MDX)
  requirements.txt        Python deps
```

## Adding a new player

Edit `lib/players.ts` — the listing, comparison, footer, sitemap and JSON-LD all wire up automatically.

## AI Content Engine (TypeScript pipeline)

The primary pipeline lives in `scripts/automation/content-engine.ts` and runs
in three stages: **Ingest → Transform → Publish**.

```bash
npm install
echo "OPENAI_API_KEY=sk-..." >> .env.local
npm run generate-blog                 # up to 3 drafts
npm run generate-blog -- --max 5      # up to 5
npm run generate-blog -- --dry-run    # preview, don't write
```

**Sources:** Ehandel.se, Breakit, PYMNTS, Digital Commerce 360, Finextra.
**Filter:** only items whose title/summary contain domain keywords (checkout,
konvertering, frakt, Klarna, Walley, Qliro, BNPL, …).
**Model:** GPT-4o (configurable via `OPENAI_MODEL`). The system prompt puts
the model in the role of a Senior Checkout Strategist and forces JSON output
containing `meta_title`, `meta_description`, `slug`, `tags`, `tldr`,
`unsplash_keyword` and a full `body_markdown` (with H2/H3 and a required
`## 3 konkreta tips för handlare` section).

**Safety:** Every generated post is written as `*.draft.mdx` with
`draft: true` in frontmatter. These never appear on the live site. A cover
image URL is auto-suggested via `source.unsplash.com/?<keyword>`.

Review, then promote:

```bash
npm run publish-drafts                # interactive
npm run publish-drafts -- --yes       # no prompt
npm run publish-drafts -- klarna      # only drafts whose filename contains "klarna"
```

De-dup state is kept in `scripts/automation/.seen.json` so the same article
is never regenerated.

### Also available

- `POST /api/generate-post` — webhook variant secured with `GENERATE_POST_TOKEN`, writes directly to `content/blog/` (live, not drafted).
- `scripts/generate_post.py` — the original Python variant kept for cron environments without Node.

## Deployment

### Alternativ A: Statiskt webbhotell (One.com, Loopia, Oderland, Binero, m.fl.)

Ingen Node-körning på server. En helt förbakad HTML/CSS/JS-bundle FTP:as upp.

```bash
# 1. (Valfritt) Konfigurera Formspree för kontaktformuläret
echo "FORMSPREE_ENDPOINT=https://formspree.io/f/<ditt-id>" >> .env.local

# 2. Bygg statisk bundle
npm run build:static

# 3. Ladda upp innehållet i /out (inte mappen i sig)
#    till webbhotellets public_html / www / htdocs-katalog via FTP/SFTP.
```

**Vad som ingår i `/out`:**

- Alla sidor som förbakade HTML-filer (`index.html`, `blog/*/index.html`, `players/*/index.html`, `guides/*/index.html`, `comparison/index.html`, `contact/index.html`)
- `sitemap.xml`, `robots.txt`, `rss.xml`, `404.html`
- `_next/` med fingerprintade JS/CSS chunks
- `logos/` med alla player-logos
- `.htaccess` för Apache (pretty URLs, gzip, caching, 404)

**Begränsningar i statiskt läge:**

- `NewsFeed` blir frusen till det ögonblick du körde `npm run build:static`. Kör kommandot om igen när du vill uppdatera nyheter.
- Kontaktformuläret kräver **Formspree** (eller motsvarande) eftersom `/api/contact` inte finns utan Node. Utan `FORMSPREE_ENDPOINT` visas en ren mailto-fallback istället för formulär.
- `/api/generate-post`-webhook fungerar inte — använd `npm run generate-blog` lokalt istället.

### Alternativ B: Vercel / Netlify (rekommenderas för full funktionalitet)

Push repo till GitHub, importera i Vercel, peka domänen. Allt funkar inkl. API-routes, server-rendered NewsFeed, revalidation.

## SEO features

- Per-route `generateMetadata` (canonicals, OG, Twitter)
- JSON-LD **Organization** (root), **Review** (players), **FAQPage** (players), **Article** (posts)
- Auto `sitemap.xml`, `robots.txt`, `rss.xml`

## Lead magnet

`/contact` POSTs to `FORMSPREE_ENDPOINT` if set, otherwise to the built-in `/api/contact` which uses Resend (if `RESEND_API_KEY` is set) or logs to stdout.

## Deploy

Optimized for Vercel. After `vercel link`, deploy with:

```bash
vercel --prod
```

Set env vars in Vercel dashboard: `SITE_URL`, `OPENAI_API_KEY`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `FORMSPREE_ENDPOINT`, `GENERATE_POST_TOKEN`.

## License

Proprietary. The domain `checkoutstrategi.se` is for sale — see `/contact`.
