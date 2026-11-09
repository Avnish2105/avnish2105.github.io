#!/usr/bin/env python3
"""Local preview server for the site/ folder, with live reload.

Usage:
    python3 scripts/serve.py            # http://localhost:8000
    python3 scripts/serve.py --port 9000

Serves site/ exactly as GitHub Pages will, but:
  * caching is disabled, so a refresh always shows your latest CSS/JS;
  * a small script is injected into HTML pages that reloads the browser
    tab automatically whenever any file under site/ is saved.
The injected script exists only in the local preview, never in your files.
"""

import argparse
import http.server
import os
import socketserver
import sys
import urllib.request
import webbrowser
from pathlib import Path

SITE_DIR = Path(__file__).resolve().parent.parent / "site"
RELOAD_PATH = "/__reload"

RELOAD_SNIPPET = b"""
<script>
(function () {
  var last = null;
  setInterval(function () {
    fetch("%s", { cache: "no-store" })
      .then(function (r) { return r.text(); })
      .then(function (t) {
        if (last !== null && t !== last) location.reload();
        last = t;
      })
      .catch(function () {});
  }, 1000);
})();
</script>
""" % RELOAD_PATH.encode()


def latest_mtime() -> str:
    newest = 0.0
    for root, _dirs, files in os.walk(SITE_DIR):
        for name in files:
            try:
                newest = max(newest, os.stat(os.path.join(root, name)).st_mtime)
            except OSError:
                pass
    return repr(newest)


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(SITE_DIR), **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_GET(self):
        path = self.path.split("?", 1)[0].split("#", 1)[0]

        if path == RELOAD_PATH:
            body = latest_mtime().encode()
            self.send_response(200)
            self.send_header("Content-Type", "text/plain")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return

        fs_path = Path(self.translate_path(path))
        if fs_path.is_dir():
            if not path.endswith("/"):
                return super().do_GET()  # base class redirects to "dir/"
            fs_path = fs_path / "index.html"
        if fs_path.suffix == ".html" and fs_path.is_file():
            html = fs_path.read_bytes()
            marker = b"</body>"
            if marker in html:
                html = html.replace(marker, RELOAD_SNIPPET + marker, 1)
            else:
                html += RELOAD_SNIPPET
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(html)))
            self.end_headers()
            self.wfile.write(html)
            return

        super().do_GET()

    def log_message(self, fmt, *args):
        if self.path.startswith(RELOAD_PATH):
            return  # don't spam the terminal with reload polls
        super().log_message(fmt, *args)


def preview_already_running(url: str) -> bool:
    try:
        with urllib.request.urlopen(url + RELOAD_PATH, timeout=1) as r:
            return r.status == 200
    except OSError:
        return False


class Server(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = True


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--port", type=int, default=8000)
    parser.add_argument("--host", default="127.0.0.1",
                        help="use 0.0.0.0 to open the preview from your phone on the same Wi-Fi")
    parser.add_argument("--open", action="store_true",
                        help="open the site in your default browser once the server starts")
    args = parser.parse_args()

    if not SITE_DIR.is_dir():
        sys.exit(f"site folder not found: {SITE_DIR}")

    url = f"http://localhost:{args.port}"
    try:
        httpd = Server((args.host, args.port), Handler)
    except OSError:
        if preview_already_running(url):
            # Another copy of this script is serving already: just reuse it.
            print(f"Serving {SITE_DIR} (already running in another terminal)")
            print(f"Preview ready at {url}", flush=True)
            if args.open:
                webbrowser.open(url)
            return
        sys.exit(f"Port {args.port} is used by another program. Try --port 9000.")

    with httpd:
        print(f"Serving {SITE_DIR}")
        print(f"Preview ready at {url}  (Ctrl+C to stop)", flush=True)
        if args.open:
            webbrowser.open(url)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nStopped.")


if __name__ == "__main__":
    main()
