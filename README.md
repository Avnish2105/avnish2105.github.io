# avnish2105.github.io

Personal portfolio of Avnish Deshmukh, live at https://avnish2105.github.io.

Plain HTML/CSS/JS. There is no build step and nothing to install except Python 3. The `make` shortcuts are optional (`sudo apt install make`).

## Preview locally

```bash
python3 scripts/serve.py          # or: make serve
```

Open http://localhost:8000. The page reloads automatically whenever you save a file in `site/`.

- Different port: `python3 scripts/serve.py --port 9000`
- Test on your phone on the same Wi-Fi: `python3 scripts/serve.py --host 0.0.0.0`, then open `http://<your-computer's-IP>:8000`

### From VS Code

- **▶ button:** open the Run and Debug panel (`Ctrl+Shift+D`), choose **Preview site**, then click the green ▶ (or press `F5`). This starts the server and opens Chrome.
- **Shortcut:** press `Ctrl+Shift+B`. This starts the server and opens your default browser.
- **Status-bar buttons (optional):** install the recommended *Task Buttons* extension when VS Code suggests it. **▶ Preview site** and **✓ Check links** then appear in the bottom bar.
- **To stop the server:** click the trash-can icon on its terminal tab.

## Check for broken links

```bash
python3 scripts/check_links.py site   # or: make check
```

This lists any image, stylesheet, script or page link that points to a missing file. The deploy runs the same check and stops if anything is broken.

## Workflow

1. `git switch -c my-change` (work on a branch, not `main`)
2. Edit files in `site/` while the preview server is running and check the result in the browser
3. `python3 scripts/check_links.py site`
4. Commit, then merge into `main` and push. GitHub Actions publishes `site/` within a minute or two.

## Layout

```
site/                      everything in here is published, nothing outside it is
  index.html               home page
  gallery.html             MIT Tech Team gallery
  favicon.ico, robots.txt, sitemap.xml, site.webmanifest, google*.html
  assets/
    css/                   styles.css (shared), gallery.css (gallery page only)
    js/                    main.js (home page), gallery.js (gallery lightbox)
    icons/                 favicons and app icons
    images/
      profile.jpeg
      logos/               skills marquee logos (logo1.png … logo23.png)
      gallery/             gallery photos
scripts/
  serve.py                 local preview server with live reload
  check_links.py           broken-link checker
.github/workflows/deploy.yml   deploys site/ to GitHub Pages on push to main
```

### Adding things

- **A gallery photo:** put it in `site/assets/images/gallery/` with a lowercase-hyphenated name (no spaces), then reference it in `gallery.html` as `assets/images/gallery/<name>.jpg`.
- **A skills logo:** add it to `site/assets/images/logos/`, then add an `<img>` to the `logo-group` in `index.html`.
- **A new page:** create `site/<page>.html`, link `assets/css/styles.css`, and add the page to `sitemap.xml`.
