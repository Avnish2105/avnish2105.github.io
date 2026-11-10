# CLAUDE.md

Guidance for Claude Code when working in this repository. Sections marked **TODO** are for the owner to fill in; leave them as-is until then and don't invent content for them. Items marked **(confirm)** are drafts from the owner's answers that still need a yes.

## 1. About the owner

- **Name:** Avnish Deshmukh
- **Tagline (live on the site):** "Final year at MIT-WPU, Pune. I debug robots by day and think on the trail."
- **Headline (live):** Robotics engineer: electronics, embedded systems & autonomy.
- **Education:** Integrated B.Tech in Electronics & Communication Engineering (AI & ML), MIT World Peace University (MIT-WPU), Pune. Diploma + B.Tech integrated programme, started 2022. Final year, graduating 2027.
- **Team:** MIT WPU-Tech Team (ABU/DD Robocon). Joined 2022 in Electronics, Electronics + Control from 2023. Vice-Captain in 2026 (15-member team). Technical mentor to ~20 recruits across electronics, mechanical and software, 2023 to present.
- **Competitions (DD Robocon, All India rank, per the resume, confirmed by owner 2026-11-11):** 2022: 3, 2023: 2, 2024: 3, 2025: participated (rank TODO), 2026: 2. That is four top-3 finishes across five seasons.
- **Experience:** Research Intern, Quadruped Robotics, DRDO, 2026 to 10 Feb 2027. Only the approved one-liner is public; see section 12.
- **Skills / tools (grouped, see section 9)**
- **Target roles:** robotics and autonomy, defence, micro robotics, swarm robotics.
- **Interests:** electronics, robotics, coding, trekking, philosophy and ideas. Proud of being multi-talented: has worked across all three robotics fields (mechanical, software, electronics) plus side interests in philosophy and trekking.
- **Links:**
  - GitHub: https://github.com/avnish2105
  - LinkedIn: https://www.linkedin.com/in/avnish-deshmukh
  - Email (owner approved for the site): avnishd2105@gmail.com
  - Instagram: dropped from the site.
- **Current focus:** final-year capstone (autonomous college guide AGV) and the DRDO internship (no details public).
- **Location / availability:** Pune, India. Live on the site: "Available full-time from mid-2027" (hero chip and Work page).
- **Short bio (live on the home page):**
  > Final-year B.Tech ECE (AI & ML) student at MIT-WPU, Pune, and Vice-Captain of the MIT WPU-Tech Robocon team. I design the electronics, write the firmware and ROS 2 software, and build the mechanisms for competition robots, with four All India top-3 finishes across five seasons. I'm looking for robotics and autonomy roles, especially in defence, micro and swarm robotics, and I like thinking about ideas as much as building machines.

## 2. Site goals

- **Purpose:** personal portfolio that ranks for the owner's name and supports the 2027 job and internship search, while also showing writing and treks.
- **Audience:** (confirm) primary: recruiters and hiring managers in robotics, autonomy and defence. Secondary: robotics teams and collaborators.
- **What a visitor should do after visiting:** all of these: email me, view GitHub, read a project, download the resume.
- **Live URL:** https://avnish2105.github.io (the only domain; no custom domain planned)
- **Tone of voice:** appropriate to each page, never harsh, nothing that makes a visitor uncomfortable.
  - Home, Work, Resume: professional and concise, a light touch of the existing humor in the hero only.
  - Writing: reflective, calm, respectful. No attacks on people, parties or groups.
  - Treks: warm and personal.
  - Gallery: light.
- **Theme:** dark mode only. No light theme, no toggle.

## 3. Tech stack

- Plain **HTML + CSS + JavaScript**. No framework, no bundler, no package manager, no build step.
- Fonts: Google Fonts (Inter, Space Grotesk, JetBrains Mono for labels/HUD). Analytics: Google Analytics (gtag) on **every** page, including the gallery.
- Hosted on **GitHub Pages**, deployed by GitHub Actions from the `site/` folder (not Jekyll).
- Tooling: Python 3 standard library only (`scripts/`).
- Keep it dependency-free. Don't add npm, a framework or a build step without asking.
- **Approved exception:** Three.js `0.160.0`, loaded as an ES module from cdn.jsdelivr.net by `assets/js/robot.js` only (home hero robot). Keep it pinned; the page must still work without it (static SVG fallback).

## 4. Site structure and repository layout

Pages (politics gets no standalone page; any civic or ideas essays live in Writing. confirm):

All five pages exist. Nav on every page: Home · Work · Writing · Treks · Gallery · Resume (PDF) (current page gets `aria-current="page"`).

| Page | File | Purpose |
|---|---|---|
| Home | `index.html` | 3D robot hero, stats, 01 about + "now", 02 featured work, 03 toolkit, 04 journey, 05 beyond the lab, 06 connect |
| Work | `work.html` (+ `projects/<name>.html` case studies) | technical background for recruiters |
| Writing | `writing/index.html` + `writing/<yyyy-mm-dd-slug>.html` | weekly essays (philosophy/ideas) and short tech notes (no posts yet) |
| Treks | `treks.html` | trek stories and photos (placeholder until content arrives) |
| Gallery | `gallery.html` | MIT Tech Team photos |

```
site/                      everything in here is published; nothing outside it is
  index.html, work.html, treks.html, gallery.html
  projects/                autonomous-campus-guide-agv.html, dd-robocon.html
  writing/                 index.html (newest first, between POSTS:START/END markers) + one file per post
  favicon.ico, robots.txt, sitemap.xml, site.webmanifest, feed.xml
  google73981eb1df2e57f0.html   Google Search Console verification: must stay at site root
  .nojekyll
  assets/
    css/                   styles.css (shared tokens, nav, buttons, footer, content-page layout), home.css, gallery.css, writing.css
    js/                    main.js (home: nav, reveals, stats, timeline), robot.js (3D quadruped + jokes, ES module), gallery.js (lightbox), analytics.js (shared gtag loader)
    icons/
    docs/                  (to create) resume PDF, public version without phone number (section 12)
    images/
      profile.jpeg
      logos/               skills marquee
      gallery/
      treks/, projects/    (to create when photos arrive)
scripts/
  serve.py                 local preview server with live reload
  check_links.py           broken local link/asset checker
  new_post.py              scaffold a post, update writing index, sitemap, feed
.github/workflows/deploy.yml
.vscode/                   tasks.json, launch.json, settings.json, extensions.json
```

## 5. Commands

| Task | Command |
|---|---|
| Preview locally (live reload) | `python3 scripts/serve.py` → http://localhost:8000 (`--port N`, `--open`, `--host 0.0.0.0`) |
| Check for broken links | `python3 scripts/check_links.py site` |
| New weekly post | `python3 scripts/new_post.py "Title" --slug my-slug --description "One line"` (`--date YYYY-MM-DD`, `--dry-run`) |
| Same via make (optional, needs `make`) | `make serve`, `make check` |
| VS Code | `F5` with "Preview site" selected, or `Ctrl+Shift+B` |

Always run the link check after moving, renaming or adding files. The deploy runs it too and fails on a missing file.

## 6. Workflow

1. Work on a branch, not `main`. Pushing to `main` publishes the site.
2. Preview with `python3 scripts/serve.py` and look at the change in a browser (desktop and phone width).
3. Run the link check.
4. Commit and merge to `main`; GitHub Actions deploys within a minute or two.

Don't commit or push unless asked.

### Weekly update routine (Writing + Now)
1. Owner gives a topic and rough notes; Claude drafts the essay in the owner's voice and tone for the Writing page.
2. Owner approves or edits the draft.
3. Create the post with `scripts/new_post.py` (updates the Writing index, `sitemap.xml` and `feed.xml`).
4. Refresh the "Now" line on the home page if anything changed.
5. Run the link check. Commit only when asked.

## 7. Conventions

- **File names:** lowercase, hyphen-separated, no spaces (`robocon-2024-team.jpg`). Posts: `yyyy-mm-dd-slug.html`.
- **Paths:** relative to the page for local assets, root-relative only in `site.webmanifest`. Absolute URLs only in meta tags (`og:image`, canonical, sitemap, feed).
- **Styling:** shared design tokens are CSS variables in `styles.css` (`--background`, `--surface`, `--surface-2`, `--border`, `--heading`, `--text`, `--text-light`, `--primary` for fills, `--primary-text` for text/links on dark, `--accent`). Reuse them, don't hard-code colors. Dark theme only (`color-scheme: dark`). Content pages use `.page`, `.page-header`, `.page-section`, `.card-grid`/`.card`, `.item-list`, `.facts`. Page-specific CSS goes in its own file in `assets/css/`, not inline.
- **Scripts:** no inline `<script>` blocks; JS goes in `assets/js/` and loads with `defer`. Analytics is `assets/js/analytics.js` on every page. `robot.js` is the one `type="module"` script. Exception: the JSON-LD `application/ld+json` data block on the home page.
- **Images:** max 1600px wide, under 300 KB each, WebP preferred. Every `<img>` needs a meaningful `alt`. (Conversion is done outside the repo; Python stdlib can't encode WebP.)
- **Accessibility:** semantic HTML, keyboard-reachable controls, visible focus (`:focus-visible` outline), sufficient contrast on the dark theme. Animations respect `prefers-reduced-motion` (the 3D robot is replaced by the static SVG, no reveals/count-up, the logo strip becomes a static grid). The skills are listed as text, so the logo strip is decorative (`alt=""`, `aria-hidden`). The "Ping the robot" button gives keyboard users the joke. TODO: gallery lightbox items aren't keyboard-reachable.
- **Responsive:** works from ~360px phone width up to wide desktop.
- **New page checklist:** link `styles.css`, `charset` + `viewport` meta, title + description + Open Graph tags, favicon links, analytics script, nav entry on every page, entry in `sitemap.xml`.
- **Page titles:** include "Avnish Deshmukh" so the name ranks.
- **Commit messages:** short, imperative, lowercase.

## 8. Page content map

| Content | File | Section |
|---|---|---|
| Name, headline, tagline, CTA buttons (email, GitHub, work, resume) | `site/index.html` | `.hero` |
| 3D robot, HUD, fallback SVG | `site/assets/js/robot.js`, `site/index.html` | `.hero-stage` |
| Stats strip | `site/index.html` | `.stats` |
| Featured work cards (keep in sync with work.html) | `site/index.html` | `.featured` |
| Bio + photo | `site/index.html` | `.about` |
| Skills (text, keep in sync with section 9) + decorative logos | `site/index.html` + `assets/images/logos/` | `.toolkit` / `.skills-marquee` |
| Timeline | `site/index.html` | `.journey` (`.tl-year` groups of `.timeline-event`) |
| "Now" line | `site/index.html` | `.now` (inside `.about`) |
| Hobbies | `site/index.html` | `.hobbies` (`.hobby-card` items) |
| Social links | `site/index.html` | `.connect` |
| Robot joke text (speech bubble) | `site/assets/js/robot.js` | `roboticsJokes` |
| Projects, skills, experience, leadership | `site/work.html` | sections per heading in section 9 |
| Essays | `site/writing/` | index + posts |
| Treks | `site/treks.html` | one block per trek |
| Gallery photos and captions | `site/gallery.html` | `.gallery-section` blocks |
| SEO / social preview | `<head>` of each page, `sitemap.xml`, `robots.txt` | n/a |

## 9. Content (from the owner and the resume)

### Projects

**Featured (top 3)**

### Autonomous College Guide AGV (final-year capstone)
- One-line summary: an autonomous guided vehicle that guides a user through the MIT-WPU campus on its own.
- Role / my contribution: TODO
- Tech used: TODO
- Year / status: 2026–27, in development
- Links: TODO
- Images / media: TODO
- What I learned / outcome: TODO

### DD Robocon with MIT WPU-Tech Team
- One-line summary: national robotics competition entries from 2022 to 2026. The site says five seasons (owner once said 6 years; TODO confirm).
- Role / my contribution: electronics and embedded subsystem design for 5 cycles; electronics + control from 2023; Vice-Captain in 2026.
- Tech used: custom PCBs (10+), STM32F446RE control systems (~10 actuators, ~15 sensors), ODrive/VESC motor control, ROS 2, SolidWorks and fabrication (2026).
- Results: see section 1.
- Links / media: TODO

### DRDO internship
- Public title: "Research Intern, Quadruped Robotics", 2026 to 10 February 2027.
- Approved public one-liner (owner, 2026-11-11): "State estimation for a legged robot operating in GPS-denied settings." Nothing more: no sensors, hardware, simulators, controllers, methods or results.

**Other projects (from resume)**
- ESP32 & STM32 breakout/shield boards (custom PCBs + firmware)
- Smart pneumatic solenoid control board (protected high-side drivers)
- ODrive ROS 2 hardware interface (ros2_control)
- DualShock 4 ROS 2 teleoperation interface
- Pure Pursuit autonomous path following in ROS 2
- Voice-controlled PLC system (third-year academic project)
- Basketball throwing mechanism (wheel-based and linear prototypes)
- Ring-throwing BLDC catapult (Nidec gearbox + ODrive)
- Robotic staff handling and lifting system, prototype (sub-25 kg robot, 25 kg lift)

Per-project template for case-study pages:

```
### <Project name>
- One-line summary:
- Role / my contribution:
- Tech used:
- Year / status:
- Links (repo, demo, video, write-up):
- Images / media (files in site/assets/images/projects/):
- What I learned / outcome:
```

### Achievements & awards
- DD Robocon placements (section 1). Nothing else to list at this time.

### Skills (grouped)
- **Core strengths (shown first on the site; owner to confirm the pick):** PCB design (Altium), embedded firmware (STM32, ESP32), C / C++, ROS 2 + ros2_control, motor control (ODrive, VESC), Python. Everything else below is listed as "Also familiar with". GPS and rotary encoders added from the resume.
- **Electronics:** Altium Designer, Autodesk EAGLE, PCB design, embedded debugging, battery management, embedded firmware development (STM32, ESP32), motor drivers
- **Robotics / ROS 2:** ROS 2, ros2_control, Docker, GitHub, Gazebo, Isaac Sim, Pure Pursuit navigation
- **Programming languages:** C, C++, Python
- **Hardware / sensors:** ODrive, VESC, VectorNav IMUs, SICK, Baumer, ifm sensors
- **Tools / CAD / fabrication:** SolidWorks, 3D printing, laser cutting, milling, turning

### Experience / roles
- MIT WPU-Tech Team: Electronics (2022), Electronics + Control (2023 onward), Vice-Captain (2026), technical mentor to ~20 recruits (2023 to present).
- DRDO intern, ends 10 Feb 2027 (details private).
- Consistent IT Solutions: not shown on the site.

### Writing
Weekly essays on philosophy and ideas, plus short technical notes. Provision: `site/writing/` with an index and one file per post, updated through the weekly routine in section 6. First topic: TODO.

### Treks
Photos are available; to be added later. Trek list and stories: TODO.

### Testimonials / mentors
Skipped.

### Resume / CV
Public PDF: `site/assets/docs/avnish-deshmukh-resume.pdf`, linked from the nav (every page), the hero and the Work page. Source: `scripts/resume/public-resume.html` (rebuild command in its header comment). The private original `Avnish_Deshmukh_Resume.pdf` in the repo root is git-ignored. See the phone-number rule in section 12.

## 10. SEO & analytics

- Primary meta description lives in `site/index.html`; keep it in sync with the bio above.
- JSON-LD `Person` markup is on the home page (name, links, MIT-WPU, Pune). Keep it in sync with section 1.
- Owner action: submit `sitemap.xml` in Search Console (verification file already in place). `feed.xml` is the RSS feed for Writing.
- Social preview image: `assets/images/og-card.jpg` (1200×630, 2023 robot photo + name) on every page; the JSON-LD `image` stays `profile.jpeg`.
- Analytics: Google Analytics ID is in `site/assets/js/analytics.js`, loaded on every page.
- Custom domain: none planned.

## 11. Roadmap / ideas

- [x] Work page with featured projects (AGV and Robocon case-study pages; DRDO as a one-liner)
- [x] Writing page, `new_post.py` and `feed.xml`
- [x] Treks page (placeholder)
- [x] Resume: public PDF (no phone, DRDO one-liner) linked from nav, hero and Work page
- [x] "Now" line on the home page
- [x] JSON-LD Person markup (submit sitemap in Search Console: owner)
- [x] Mailto contact button
- [x] Home redesign: 3D quadruped hero (Three.js), new visual system shared via styles.css
- [x] Reduced-motion handling for the robot, reveals and marquee
- [ ] Optimise gallery photos (WebP, 1600px max, under 300 KB). Currently ~66 MB, 7–8 MB per photo
- [x] Dark mode only
- [x] Skills listed as text; logo strip made decorative (no alt text needed)
- [ ] Fill in the AGV case study, Robocon media, treks and the first essay

## 12. Rules for Claude

- Only edit under `site/` for website changes; keep tooling changes in `scripts/` and `.vscode/`.
- Keep the site static and dependency-free.
- Don't invent facts about the owner (projects, dates, employers, awards). If content is missing, leave a TODO or ask.
- DRDO: publish only the title, dates and approved one-liner (section 9). Never add sensors, hardware, methods or results, on the site or in the public resume, even though the private resume lists them.
- Never publish the owner's phone number. The resume PDF contains one, so publish a version without it.
- Politics is not a page. Writing posts stay calm and respectful in tone.
- Never delete or rename `google73981eb1df2e57f0.html`, `robots.txt` or `sitemap.xml` without asking, as they affect search indexing.
- Run `python3 scripts/check_links.py site` before telling the owner a change is done.
- Don't commit or push unless asked; suggest a branch first.
- Treat contact details and private info as private; use only what the owner has approved for the site.