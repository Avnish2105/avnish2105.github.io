#!/usr/bin/env python3
"""Check that every local href/src in the site's HTML points to a real file.

Usage: python3 scripts/check_links.py site
Exits with status 1 if anything is missing (the deploy workflow relies on this).
"""

import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

SKIP_SCHEMES = {"http", "https", "mailto", "tel", "data", "javascript"}


class RefCollector(HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs = []

    def handle_starttag(self, tag, attrs):
        for name, value in attrs:
            if name in ("href", "src") and value:
                self.refs.append((self.getpos()[0], value))


def resolve(site: Path, page: Path, ref: str):
    """Return the file a reference points to, or None if it isn't a local file."""
    parts = urlsplit(ref)
    if parts.scheme in SKIP_SCHEMES or parts.netloc or ref.startswith("//"):
        return None
    if not parts.path:  # pure "#anchor" or "?query"
        return None
    path = unquote(parts.path)
    target = site / path.lstrip("/") if path.startswith("/") else page.parent / path
    if path.endswith("/"):
        target = target / "index.html"
    return target


def main():
    site = Path(sys.argv[1] if len(sys.argv) > 1 else "site").resolve()
    if not site.is_dir():
        sys.exit(f"not a directory: {site}")

    missing = 0
    checked = 0
    for page in sorted(site.rglob("*.html")):
        parser = RefCollector()
        parser.feed(page.read_text(encoding="utf-8", errors="replace"))
        for line, ref in parser.refs:
            target = resolve(site, page, ref)
            if target is None:
                continue
            checked += 1
            if not target.exists():
                missing += 1
                print(f"MISSING  {page.relative_to(site)}:{line}  ->  {ref}")

    print(f"Checked {checked} local references, {missing} missing.")
    sys.exit(1 if missing else 0)


if __name__ == "__main__":
    main()
