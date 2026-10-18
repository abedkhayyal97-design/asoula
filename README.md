# عسولة — Asoula

Static site that is a pixel-identical copy of the original (https://aasolabrand1.netlify.app/) with invisible improvements only.

- `src/original.html` — original HTML/CSS/JS, the base (unchanged design and behaviour).
- `data/products.json` — the 4 honey types (name, colour, taste, season, benefits…). `data/site.json` — brand, WhatsApp number, copyright holder, site URL.
- `fonts.css` + `docs/fonts/` — self-hosted woff2 subsets (Markazi Text 700, IBM Plex Sans Arabic 400/600).
- `build.mjs` — `node build.mjs` writes `docs/` (minify with esbuild if installed, SEO meta/OG/JSON-LD, sitemap, robots, manifest, prerendered first tab, static WhatsApp links, a11y attributes).
- `src/art.mjs` — all vector artwork (HD honey jar, bee, logo, wildflowers) generated with fixed precision; `src/bee.js` — interactive bee (catch / perch / bubbles); `src/extra.css` — styles for those additions.
- `tools/assets.js` — renders favicon.svg/.ico, app icons (192/512/1024/maskable) and og.jpg (1200×630, 2× supersampled) from the same art.
- `docs/` — what GitHub Pages serves (main branch, /docs).
- `tools/compare.js`, `tools/diff.py`, `tools/behave.js` — visual/behaviour comparison against the original.

Edit text/numbers in `data/*.json`, run `SITE_URL=https://your-domain/ node build.mjs`, commit, push.

Custom domain: add a `docs/CNAME` file with the domain; DNS A records 185.199.108.153 / .109.153 / .110.153 / .111.153, `www` CNAME → abedkhayyal97-design.github.io; rebuild with `SITE_URL`.
