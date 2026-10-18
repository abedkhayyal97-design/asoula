# عسولة — Asoula

Static Arabic (RTL) site for Asoula honey. Design = exact copy of the original (https://aasolabrand1.netlify.app/) plus the "master plan" additions
(nav + mobile menu, product cards, product pages, why/story/compare/FAQ sections, expanded footer, privacy page).
Live: https://abedkhayyal97-design.github.io/asoula/

## Structure
- `src/original.html` — original HTML/CSS/JS (base design, unchanged look).
- `src/pages.mjs` — generators for everything added by the master plan (header, footer, cards, sections, product pages, privacy page).
- `src/extra.css` — styles for all additions (reuses the existing CSS variables; dark mode works automatically).
- `src/menu.js` (mobile menu), `src/product.js` (qty/weight → WhatsApp message), `src/bee.js` (interactive bee), `src/art.mjs` (jar, bee, flowers).
- `data/site.json` — all site texts, WhatsApp number, section copy, FAQ, footer fields.  `data/products.json` — the 4 honeys.
- `build.mjs` — `node build.mjs` writes everything into `docs/` (index, `honey/<slug>/`, `privacy/`, sitemap, robots, manifest).
- `docs/` — what GitHub Pages serves (branch `main`, folder `/docs`).
- `brand-v3/src/` — scripts that produced the logo cutout/icons from the brand image.
- `tools/` — test scripts (see "Testing").

## Run locally
```bash
npm i esbuild            # optional (minifies CSS/JS); the build also works without it
node build.mjs           # rebuild docs/ after editing data/*.json or src/*
node tools/serve-gz.js 8801   # tiny gzip static server -> http://localhost:8801/
```
Custom site URL (canonical/OG/sitemap): `SITE_URL=https://your-domain/ node build.mjs`.

## Deploy to GitHub Pages
1. `node build.mjs` (commit the regenerated `docs/`).
2. `git add -A && git commit -m "..." && git push origin main`.
3. Repo → Settings → Pages: Source = `main`, folder `/docs` (already configured). The site updates in ~1 minute.
4. Custom domain: add `docs/CNAME` with the domain; DNS A records 185.199.108.153 / .109.153 / .110.153 / .111.153, `www` CNAME → `abedkhayyal97-design.github.io`; rebuild with `SITE_URL`.
Backup of the state before the master plan: git tag `pre-master-plan` and branch `backup/pre-master-plan`.

## Data the owner must fill (nothing is invented; empty = hidden or a neutral placeholder)
In `data/products.json`, per honey:
| field | format | when empty |
|---|---|---|
| `price` | `"50,000 ل.س"` | card/page shows "السعر عند الطلب" |
| `weights` | `[{"label":"500 غ","price":"25,000 ل.س"}]` (`price` optional) | no weight picker; WhatsApp message has no weight line |
| `availability` | `"متوفر"` / `"غير متوفر حالياً"` / `"حسب الموسم"` | no badge |
| `photo` | `{"src":"img/kina.webp","width":1000,"height":1000,"alt":"..."}` — put the real photo (webp) in `docs/img/` | jar artwork is shown |
| `gallery` | list of the same shape | no thumbnails |
| `origin` | text (region / apiary) | "سيُضاف قريباً" note + WhatsApp link |
| `storage` | text | "سيُضاف قريباً" note |
| `faq` | `[{"q":"...","a":"..."}]` | only the general questions |
In `data/site.json`:
- `story.origin.text` (region/apiary story), `story.photo` (same shape as `photo`) — otherwise a neutral note / jar art.
- `footer.delivery` (delivery info; also used in the FAQ answer) — otherwise the FAQ says "تواصل معنا عبر واتساب للتأكد".
- `footer.social.{instagram,facebook,tiktok,youtube}` — full `https://` links; empty ones are not shown.
- `copyrightHolder`, `whatsapp` (+963 997 883 618 — do not change without the owner), `privacy.updated`.
Never put unverified prices, certificates, health claims or numbers in these files.

## Testing (headless Chrome, `/tmp/pp/node_modules/puppeteer-core` + lighthouse)
- `node tools/qa.js <url> [<url-with-sample-data>]` — 7 widths × 6 pages: no horizontal scroll, tap targets ≥ 44px, console/network errors, RTL; mobile menu (open/Esc/link/header height); WhatsApp message decode.
- `node tools/linkcheck.js <url>` — crawls the sitemap, checks every internal link/asset/anchor and external link.
- `node tools/audit.js <url>` — headings, meta/canonical/OG, JSON-LD, cookies/storage/third-party requests/forms (privacy page facts).
- `node tools/plan-shots.js <url> plan-` / `tools/page-shots.js` — section screenshots → `screenshots/`.
- `node tools/bee-test.js <url>` — interactive bee (mouse/touch/keyboard/reduced motion).
- Lighthouse: `lighthouse <url> --only-categories=performance,accessibility,best-practices,seo`.
