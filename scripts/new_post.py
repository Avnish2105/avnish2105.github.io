#!/usr/bin/env python3
"""Scaffold a new Writing post and register it everywhere it needs to appear.

Usage:
    python3 scripts/new_post.py "Title" --slug my-slug [--date 2026-11-10]
                                [--description "One-line summary"] [--dry-run]

Creates site/writing/<date>-<slug>.html from the template below, then:
  - adds it to the top of the list in site/writing/index.html (newest first)
  - adds a <url> entry to site/sitemap.xml
  - adds an <item> to site/feed.xml and bumps <lastBuildDate>

Write the post body afterwards by editing the new file (the <div class="post-body">).
Standard library only. Run the link check when you're done:
    python3 scripts/check_links.py site
"""

import argparse
import re
import sys
from datetime import date, datetime, time, timedelta, timezone
from email.utils import format_datetime
from html import escape
from pathlib import Path

BASE = "https://avnish2105.github.io/"
SITE = Path(__file__).resolve().parent.parent / "site"
IST = timezone(timedelta(hours=5, minutes=30))

POSTS_MARKER = "<!-- POSTS:END -->"
SITEMAP_MARKER = "<!-- POSTS (scripts/new_post.py inserts here) -->"
FEED_MARKER = "<!-- ITEMS (newest first; scripts/new_post.py inserts here) -->"

# Keep the <head>, nav and footer in step with site/writing/index.html.
TEMPLATE = """<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="dark">
    <meta name="theme-color" content="#070b14">
    <title>{title} - Avnish Deshmukh</title>
    <meta name="description" content="{description}">
    <meta name="author" content="Avnish Deshmukh">
    <link rel="canonical" href="{url}">

    <!-- Open Graph / Twitter -->
    <meta property="og:type" content="article">
    <meta property="og:url" content="{url}">
    <meta property="og:title" content="{title} - Avnish Deshmukh">
    <meta property="og:description" content="{description}">
    <meta property="og:image" content="{base}assets/images/profile.jpeg">
    <meta property="article:published_time" content="{iso_date}">
    <meta name="twitter:card" content="summary_large_image">

    <script defer src="../assets/js/analytics.js"></script>
    <script defer src="../assets/js/nav.js"></script>
    <link rel="stylesheet" href="../assets/css/styles.css">
    <link rel="stylesheet" href="../assets/css/writing.css">

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">

    <!-- Favicon -->
    <link rel="icon" href="../favicon.ico" sizes="any">
    <link rel="icon" sizes="32x32" href="../assets/icons/favicon-32x32.png" type="image/png">
    <link rel="icon" sizes="16x16" href="../assets/icons/favicon-16x16.png" type="image/png">
    <link rel="apple-touch-icon" href="../assets/icons/apple-touch-icon.png">
    <link rel="manifest" href="../site.webmanifest">
    <link rel="alternate" type="application/rss+xml" title="Avnish Deshmukh - Writing" href="../feed.xml">
</head>

<body>
    <nav class="navbar" aria-label="Main">
        <div class="nav-content">
            <a href="../index.html" class="logo" aria-label="Avnish Deshmukh, home">AD</a>
            <div class="nav-links">
                <a href="../index.html">Home</a>
                <a href="../work.html">Work</a>
                <a href="index.html" aria-current="page">Writing</a>
                <a href="../treks.html">Treks</a>
                <a href="../gallery.html">Gallery</a>
            </div>
        </div>
    </nav>

    <main class="page">
        <p class="breadcrumb"><a href="index.html">Writing</a> / {title}</p>
        <article class="post">
            <header>
                <h1>{title}</h1>
                <p class="post-meta"><time datetime="{iso_date}">{human_date}</time> · Avnish Deshmukh</p>
            </header>
            <div class="post-body">
                <!-- TODO: write the post. Use <p>, <h2>, <blockquote>, <ul>, <pre><code>. -->
                <p>{description}</p>
            </div>
            <footer class="post-footer">
                <a href="index.html">&larr; All writing</a>
            </footer>
        </article>
    </main>

    <footer>
        <p>&copy; {year} Avnish Deshmukh. Building the future with code and robotics.</p>
    </footer>
</body>

</html>
"""


def slugify(text: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    if not slug:
        sys.exit("slug is empty; pass --slug with letters or digits")
    return slug


def insert_before(path: Path, marker: str, block: str) -> str:
    text = path.read_text(encoding="utf-8")
    if marker not in text:
        sys.exit(f"marker not found in {path.relative_to(SITE.parent)}: {marker}")
    return text.replace(marker, block + marker, 1)


def insert_after(path: Path, marker: str, block: str) -> str:
    text = path.read_text(encoding="utf-8")
    if marker not in text:
        sys.exit(f"marker not found in {path.relative_to(SITE.parent)}: {marker}")
    return text.replace(marker, marker + block, 1)


def main():
    parser = argparse.ArgumentParser(description="Scaffold a new Writing post.")
    parser.add_argument("title", help="post title")
    parser.add_argument("--slug", help="URL slug (default: from the title)")
    parser.add_argument("--date", help="publish date YYYY-MM-DD (default: today)")
    parser.add_argument("--description", default="",
                        help="one-line summary for the index, meta tags and feed")
    parser.add_argument("--dry-run", action="store_true", help="show what would change")
    args = parser.parse_args()

    post_date = date.fromisoformat(args.date) if args.date else date.today()
    slug = slugify(args.slug or args.title)
    filename = f"{post_date.isoformat()}-{slug}.html"
    post_path = SITE / "writing" / filename
    url = f"{BASE}writing/{filename}"

    if post_path.exists():
        sys.exit(f"already exists: {post_path.relative_to(SITE.parent)}")

    title = escape(args.title, quote=True)
    description = escape(args.description or f"TODO: one-line summary of {args.title}", quote=True)
    human_date = f"{post_date.day} {post_date.strftime('%B %Y')}"
    pub_date = format_datetime(datetime.combine(post_date, time(9, 0), IST))
    now = format_datetime(datetime.now(IST).replace(microsecond=0))

    post_html = TEMPLATE.format(title=title, description=description, url=url, base=BASE,
                                iso_date=post_date.isoformat(), human_date=human_date,
                                year=post_date.year)

    # Writing index: newest first, so insert right after POSTS:START, i.e. at the top.
    index_path = SITE / "writing" / "index.html"
    index_text = index_path.read_text(encoding="utf-8")
    start = re.search(r"<!-- POSTS:START[^>]*-->", index_text)
    if not start or POSTS_MARKER not in index_text:
        sys.exit("POSTS:START / POSTS:END markers not found in site/writing/index.html")
    entry = (f'\n                <li>\n'
             f'                    <a href="{filename}">{title}</a>\n'
             f'                    <time datetime="{post_date.isoformat()}">{human_date}</time>\n'
             f'                    <p>{description}</p>\n'
             f'                </li>')
    index_text = index_text[:start.end()] + entry + index_text[start.end():]
    # Drop the "first post is on its way" placeholder once a post exists.
    index_text = re.sub(r'\n\s*<p class="empty-state" id="no-posts">.*?</p>', "", index_text)

    sitemap_path = SITE / "sitemap.xml"
    sitemap_text = insert_before(sitemap_path, SITEMAP_MARKER,
        f"<url>\n        <loc>{url}</loc>\n        <lastmod>{post_date.isoformat()}</lastmod>\n"
        f"        <changefreq>yearly</changefreq>\n        <priority>0.6</priority>\n    </url>\n    ")
    sitemap_text = re.sub(r"(<loc>https://avnish2105\.github\.io/writing/</loc>\s*<lastmod>)[^<]*",
                          rf"\g<1>{post_date.isoformat()}", sitemap_text)

    feed_path = SITE / "feed.xml"
    feed_text = insert_after(feed_path, FEED_MARKER,
        f"\n        <item>\n            <title>{title}</title>\n            <link>{url}</link>\n"
        f"            <guid isPermaLink=\"true\">{url}</guid>\n            <pubDate>{pub_date}</pubDate>\n"
        f"            <description>{description}</description>\n        </item>")
    feed_text = re.sub(r"<lastBuildDate>[^<]*</lastBuildDate>",
                       f"<lastBuildDate>{now}</lastBuildDate>", feed_text, count=1)

    changes = [(post_path, post_html), (index_path, index_text),
               (sitemap_path, sitemap_text), (feed_path, feed_text)]
    for path, text in changes:
        rel = path.relative_to(SITE.parent)
        if args.dry_run:
            print(f"would write {rel}")
        else:
            path.write_text(text, encoding="utf-8")
            print(f"wrote {rel}")

    if not args.dry_run:
        print(f"\nNext: write the post body in {post_path.relative_to(SITE.parent)}, "
              "then run: python3 scripts/check_links.py site")


if __name__ == "__main__":
    main()
