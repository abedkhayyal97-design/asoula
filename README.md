# عسولة — Asoula (mountain honey)

Static Arabic (RTL) website. No framework, no runtime JavaScript. Content lives in JSON; `node build.mjs` generates `docs/` (the published site).

## Edit content
- `data/products.json` — honey types (name, colour, description, taste, season, benefits…). Optional per product:
  `"price": "…"`, `"weights": ["500 غ", "1 كغ"]`, `"photo": {"src":"images/x.webp","w":1200,"h":900,"alt":"…"}` (put the image in `docs/images/`). Empty = not shown (nothing is invented).
- `data/site.json` — texts, WhatsApp number (`whatsapp`, digits only with country code), copyright holder, `siteUrl`.
- Then: `node build.mjs` (Node 18+) and commit/push. GitHub Pages serves `/docs` from `main`.

## Custom domain (e.g. asoula.com)
1. Buy the domain (any registrar).
2. GitHub repo → Settings → Pages → *Custom domain* → enter `asoula.com` (or `www.asoula.com`) → Save. Tick *Enforce HTTPS* once the certificate is issued (can take up to ~1 h).
3. At the registrar's DNS:
   - apex `asoula.com`: four `A` records → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (optional `AAAA`: `2606:50c0:8000::153`, `…8001::153`, `…8002::153`, `…8003::153`)
   - `www`: `CNAME` → `abedkhayyal97-design.github.io`
4. Rebuild with the new address so canonical/OG/sitemap point to it: `SITE_URL=https://asoula.com/ node build.mjs` (also edit `siteUrl` in `data/site.json`), commit, push.

Moving to Cloudflare Pages later: `docs/` is the output directory, no build command needed.
