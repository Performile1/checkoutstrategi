import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';

export const runtime = 'nodejs';

interface GenerateBody {
  headline: string;
  source?: string;
  url?: string;
  summary?: string;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[åä]/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80);
}

/**
 * Takes a news headline (+ optional summary/source/url) and either:
 * 1. Calls OpenAI (if OPENAI_API_KEY is set) to draft a structured SEO article
 *    focused on checkout optimization angles, or
 * 2. Falls back to a local template.
 *
 * The resulting MDX file is written to /content/blog so it gets picked up
 * by the blog engine immediately.
 *
 * Secured via GENERATE_POST_TOKEN header: x-generate-token.
 */
export async function POST(req: NextRequest) {
  const token = req.headers.get('x-generate-token');
  if (!process.env.GENERATE_POST_TOKEN || token !== process.env.GENERATE_POST_TOKEN) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: GenerateBody;
  try {
    body = (await req.json()) as GenerateBody;
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  if (!body.headline) {
    return NextResponse.json({ error: 'headline is required' }, { status: 400 });
  }

  const { title, description, markdown } = await buildArticle(body);

  const slug = `${new Date().toISOString().slice(0, 10)}-${slugify(body.headline)}`;
  const dir = path.join(process.cwd(), 'content', 'blog');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${slug}.mdx`);

  const frontmatter = [
    '---',
    `title: ${JSON.stringify(title)}`,
    `description: ${JSON.stringify(description)}`,
    `date: ${new Date().toISOString()}`,
    `author: "Checkoutstrategi AI"`,
    `tags: ["ai", "news", "checkout"]`,
    body.source ? `source: ${JSON.stringify(body.source)}` : null,
    body.url ? `sourceUrl: ${JSON.stringify(body.url)}` : null,
    '---',
    '',
  ].filter(Boolean).join('\n');

  fs.writeFileSync(file, `${frontmatter}\n${markdown}\n`, 'utf8');

  return NextResponse.json({ ok: true, slug, file: `/blog/${slug}` });
}

async function buildArticle(body: GenerateBody) {
  const apiKey = process.env.OPENAI_API_KEY;
  const systemPrompt =
    'Du är senior CRO-analytiker på Checkoutstrategi.se. Skriv en strukturerad SEO-artikel på svenska om nyhetshändelsen ur ett checkout-optimerings-perspektiv. Använd H2/H3, punktlistor, och en tydlig "Vad betyder detta för svenska e-handlare?"-sektion. 600-900 ord. Markdown.';
  const userPrompt = `Rubrik: ${body.headline}\nKälla: ${body.source || 'okänd'}\nSammanfattning: ${body.summary || '(saknas – extrapolera från rubriken)'}\nURL: ${body.url || ''}`;

  if (apiKey) {
    try {
      const r = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.4,
        }),
      });
      if (r.ok) {
        const data: any = await r.json();
        const content: string = data?.choices?.[0]?.message?.content ?? '';
        const title = body.headline;
        const description = body.summary?.slice(0, 160) || `${body.headline} – analys ur svenskt checkout-perspektiv.`;
        return { title, description, markdown: content };
      }
    } catch {
      /* fall through to template */
    }
  }

  // Fallback template
  const title = body.headline;
  const description = body.summary?.slice(0, 160) || `${body.headline} – analys ur svenskt checkout-perspektiv.`;
  const markdown = `
> Källa: ${body.source || 'okänd'}${body.url ? ` – [länk](${body.url})` : ''}

## Sammanfattning

${body.summary || `Rubriken "${body.headline}" indikerar en förändring som kan påverka hur nordiska e-handlare designar sin kassa.`}

## Vad betyder detta för checkout-optimering?

- **Konverteringsvinkel:** Nya signaler i kundens beslutsprocess kan flytta var friktion uppstår i kassan.
- **BNPL & betalmetoder:** Utvärdera om din betalmix (Klarna, Walley, Qliro) fortfarande speglar målgruppens preferenser.
- **Leveransupplevelse:** Delivery experience-plattformar som Ingrid och nShift blir extra relevanta när kostnads- eller hastighetsförväntningar skiftar.

## Vad du bör göra nästa vecka

1. Kör en micro-audit av din checkout med vår [jämförelsetabell](/comparison).
2. Lägg till minst en post-purchase upsell-yta (Walley Engage eller motsvarande).
3. A/B-testa leveransvalets ordning med Ingrid/nShift.

## Hur vi på Checkoutstrategi tänker

Den här händelsen bekräftar trenden mot **composable checkout**: varumärken som äger UI-lagret (t.ex. via Kustom) och kombinerar bästa BNPL + bästa leverans vinner mot alla-i-ett-stacken.

_Den här artikeln genererades automatiskt av Checkoutstrategis AI-pipeline och redigerades sedan för precision._
`.trim();

  return { title, description, markdown };
}
