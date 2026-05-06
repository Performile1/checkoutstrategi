#!/usr/bin/env python3
"""
Checkoutstrategi – AI blog pipeline
-----------------------------------
Scans RSS feeds from Ehandel.se, Digital Commerce 360 and Finextra,
selects the freshest unseen headlines, and calls OpenAI to draft
structured SEO articles about each one from a checkout-optimization
perspective. The resulting MDX files are written to /content/blog.

Usage:
    python scripts/generate_post.py            # use OpenAI if OPENAI_API_KEY is set
    python scripts/generate_post.py --max 3    # limit number of posts
    python scripts/generate_post.py --dry-run  # only print, don't write

Recommended schedule: cron / GitHub Action once per week.

Dependencies (install via `pip install -r scripts/requirements.txt`):
    feedparser>=6.0.0
    requests>=2.31.0
    python-slugify>=8.0.0
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

try:
    import feedparser  # type: ignore
    import requests
    from slugify import slugify
except ImportError as e:
    sys.stderr.write(f"Missing dependency: {e}. Run: pip install -r scripts/requirements.txt\n")
    sys.exit(1)

ROOT = Path(__file__).resolve().parent.parent
BLOG_DIR = ROOT / "content" / "blog"
STATE_FILE = ROOT / "scripts" / ".seen.json"

FEEDS = [
    ("Ehandel.se", "https://www.ehandel.se/feed"),
    ("Digital Commerce 360", "https://www.digitalcommerce360.com/feed/"),
    ("Finextra", "https://www.finextra.com/rss/headlines.aspx"),
]

SYSTEM_PROMPT = (
    "Du är senior CRO-analytiker på Checkoutstrategi.se. "
    "Skriv en strukturerad SEO-artikel på svenska (600–900 ord) om nyhetshändelsen "
    "ur ett checkout- och konverterings-optimeringsperspektiv. Använd H2/H3, punktlistor, "
    "och en tydlig 'Vad betyder detta för svenska e-handlare?'-sektion. "
    "Koppla där möjligt till Klarna, Walley, Qliro, Kustom, Ingrid och nShift. "
    "Skriv enbart Markdown – ingen frontmatter."
)


def load_seen() -> set[str]:
    if STATE_FILE.exists():
        try:
            return set(json.loads(STATE_FILE.read_text("utf-8")))
        except Exception:
            return set()
    return set()


def save_seen(seen: set[str]) -> None:
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    STATE_FILE.write_text(json.dumps(sorted(seen), ensure_ascii=False, indent=2), "utf-8")


def fetch_headlines() -> list[dict]:
    items: list[dict] = []
    for source, url in FEEDS:
        try:
            feed = feedparser.parse(url)
            for entry in feed.entries[:10]:
                items.append({
                    "source": source,
                    "title": entry.get("title", "").strip(),
                    "url": entry.get("link", ""),
                    "summary": re.sub(r"<[^>]+>", "", entry.get("summary", "")).strip()[:500],
                    "published": entry.get("published", ""),
                })
        except Exception as e:
            sys.stderr.write(f"Feed error {source}: {e}\n")
    return items


def call_openai(headline: str, source: str, summary: str, url: str) -> str | None:
    key = os.environ.get("OPENAI_API_KEY")
    if not key:
        return None
    try:
        r = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
            json={
                "model": os.environ.get("OPENAI_MODEL", "gpt-4o-mini"),
                "temperature": 0.4,
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {
                        "role": "user",
                        "content": f"Rubrik: {headline}\nKälla: {source}\nURL: {url}\nSammanfattning: {summary}",
                    },
                ],
            },
            timeout=60,
        )
        r.raise_for_status()
        return r.json()["choices"][0]["message"]["content"]
    except Exception as e:
        sys.stderr.write(f"OpenAI error: {e}\n")
        return None


def fallback_markdown(headline: str, source: str, summary: str, url: str) -> str:
    return (
        f"> Källa: {source} – [länk]({url})\n\n"
        f"## Sammanfattning\n\n{summary or headline}\n\n"
        "## Vad betyder detta för svenska e-handlare?\n\n"
        "- **Konverteringsvinkel:** utvärdera hur nyheten påverkar friktion i kassan.\n"
        "- **BNPL & betalmetoder:** Klarna, Walley och Qliro kan reagera olika.\n"
        "- **Leverans:** Ingrid och nShift är relevanta när kundförväntan skiftar.\n\n"
        "## Nästa steg\n\n"
        "1. Audit din kassa med [vår jämförelsetabell](/comparison).\n"
        "2. Prova en A/B-test i leveranssteget.\n"
        "3. Mät funnel, inte bara sessions.\n"
    )


def write_post(headline: str, source: str, summary: str, url: str, body: str) -> Path:
    BLOG_DIR.mkdir(parents=True, exist_ok=True)
    slug = f"{datetime.now(timezone.utc).strftime('%Y-%m-%d')}-{slugify(headline)[:70]}"
    path = BLOG_DIR / f"{slug}.mdx"
    description = (summary or headline)[:160]
    frontmatter = (
        "---\n"
        f"title: {json.dumps(headline, ensure_ascii=False)}\n"
        f"description: {json.dumps(description, ensure_ascii=False)}\n"
        f"date: {datetime.now(timezone.utc).isoformat()}\n"
        "author: \"Checkoutstrategi AI\"\n"
        "tags: [\"ai\", \"news\", \"checkout\"]\n"
        f"source: {json.dumps(source, ensure_ascii=False)}\n"
        f"sourceUrl: {json.dumps(url, ensure_ascii=False)}\n"
        "---\n\n"
    )
    path.write_text(frontmatter + body + "\n", encoding="utf-8")
    return path


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--max", type=int, default=3, help="max posts to generate this run")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    seen = load_seen()
    headlines = fetch_headlines()
    new = [h for h in headlines if h["url"] and h["url"] not in seen]
    new = new[: args.max]

    if not new:
        print("No new headlines. Exiting.")
        return 0

    written: list[str] = []
    for h in new:
        body = call_openai(h["title"], h["source"], h["summary"], h["url"]) or fallback_markdown(
            h["title"], h["source"], h["summary"], h["url"]
        )
        if args.dry_run:
            print(f"[dry-run] would write: {h['title']}")
        else:
            p = write_post(h["title"], h["source"], h["summary"], h["url"], body)
            written.append(str(p.relative_to(ROOT)))
            seen.add(h["url"])

    if not args.dry_run:
        save_seen(seen)

    print(f"Done. Wrote {len(written)} post(s):")
    for w in written:
        print(f"  - {w}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
