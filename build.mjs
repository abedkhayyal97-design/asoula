// Static site generator for Asoula (no dependencies). Run: node build.mjs   (SITE_URL=https://yourdomain.com/ node build.mjs)
import fs from "node:fs";
const rd=f=>fs.readFileSync(new URL(f,import.meta.url),"utf8");
const S=JSON.parse(rd("data/site.json")),P=JSON.parse(rd("data/products.json"));
if(process.env.SITE_URL)S.siteUrl=process.env.SITE_URL.replace(/\/?$/,"/");
const OUT=new URL("docs/",import.meta.url);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const wa=(msg)=>`https://wa.me/${S.whatsapp}?text=${encodeURIComponent(msg)}`;
const WAI='<svg class="wa-i" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.2.1-.1 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3z"/></svg>';
// jar artwork reused from the original site (SVG), fonts mapped to the self-hosted ones
let defs=rd("ref/jar-defs.svg").replace(/'Canela Arabic','Markazi Text',serif/g,"'Markazi Text',serif").replace(/'Dahab Arabic ITF','IBM Plex Sans Arabic',sans-serif/g,"'IBM Plex Sans Arabic',sans-serif");
const jar=(c,role)=>`<svg class="jar" ${c?`style="--c:${c}" `:""}viewBox="0 0 200 260" width="200" height="260" ${role?`role="img" aria-label="${esc(role)}"`:'aria-hidden="true"'}><use href="#jb"/><g clip-path="url(#jc)"><path class="wv" style="fill:var(--c);stroke:#fff;stroke-opacity:.4;stroke-width:1.5" d="M-80 94q20-8 40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0V262H-80z"/><circle class="bb" cx="64" cy="228" r="3"/><circle class="bb" style="animation-delay:-3s" cx="124" cy="214" r="2.4"/><circle class="bb" style="animation-delay:-5s" cx="150" cy="236" r="2"/></g><path class="dr" style="fill:var(--c);stroke:#fff;stroke-opacity:.35;stroke-width:1.5" d="M122 76c0 14 4 20 4 34a8 8 0 0 1-16 0c0-14 4-18 4-34z"/><use href="#jf"/></svg>`;
const li=a=>a.map(x=>`<li>${esc(x)}</li>`).join("");
const card=p=>`<article class="card" id="${p.id}" style="--c:${p.color}" aria-labelledby="${p.id}-h">
 <div class="top">${jar(p.color)}<div><h3 id="${p.id}-h">عسل ${esc(p.name)}</h3><p class="mu">${esc(p.desc)}</p></div></div>
 ${p.photo?`<img class="photo" src="${esc(p.photo.src)}" width="${p.photo.w}" height="${p.photo.h}" alt="${esc(p.photo.alt||"عسل "+p.name)}" loading="lazy" decoding="async">`:""}
 <div class="facts"><b>${esc(p.taste)}</b><b>القطاف: ${esc(p.season)}</b>${p.price?`<b class="price">${esc(p.price)}</b>`:""}${(p.weights||[]).map(w=>`<b>${esc(w)}</b>`).join("")}</div>
 <div class="cols"><div class="col"><h4>فوائده</h4><ul>${li(p.benefits)}</ul></div><div class="col"><h4>يفيد مَن؟</h4><ul>${li(p.for)}</ul></div><div class="col"><h4>يساعد على الوقاية من</h4><ul>${li(p.prevents)}</ul></div></div>
 <a class="btn" href="${wa("مرحباً عسولة، أريد الاستفسار عن: عسل "+p.name)}" target="_blank" rel="noopener">${WAI}اطلب عسل ${esc(p.name)} عبر واتساب</a>
 <p class="nt">${esc(S.productsSection.note)}</p></article>`;
const band=S.band.map(x=>`<span>${esc(x)}</span>`).join("");
const gen=wa("استفسار عام"),ctaWa=wa(S.cta.generalMessage);
const ld=[{"@context":"https://schema.org","@type":"Organization","name":S.brand,"url":S.siteUrl,"slogan":S.tagline,"telephone":S.phoneDisplay.replace(/\s/g,""),"logo":S.siteUrl+"icon-512.png","contactPoint":{"@type":"ContactPoint","telephone":S.phoneDisplay.replace(/\s/g,""),"contactType":"sales","availableLanguage":"Arabic"}},
{"@context":"https://schema.org","@type":"WebSite","name":S.brand,"url":S.siteUrl,"inLanguage":"ar"},
{"@context":"https://schema.org","@type":"ItemList","name":S.productsSection.title,"itemListElement":P.map((p,i)=>({"@type":"ListItem","position":i+1,"item":{"@type":"Product","name":"عسل "+p.name,"description":p.desc+" الطعم: "+p.taste+". القطاف: "+p.season+".","brand":{"@type":"Brand","name":S.brand},"url":S.siteUrl+"#"+p.id,...(p.price?{}:{})}}))}];
const css=rd("fonts.css")+"\n"+rd("src/style.css");
const html=`<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(S.title)}</title>
<meta name="description" content="${esc(S.description)}">
<meta name="theme-color" content="#1B241A">
<link rel="canonical" href="${S.siteUrl}">
<meta property="og:type" content="website"><meta property="og:locale" content="ar_SY"><meta property="og:site_name" content="${esc(S.brand)}">
<meta property="og:title" content="${esc(S.title)}"><meta property="og:description" content="${esc(S.description)}">
<meta property="og:url" content="${S.siteUrl}"><meta property="og:image" content="${S.siteUrl}og.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="مرطبان عسل عسولة – عسل جبلي">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(S.title)}"><meta name="twitter:description" content="${esc(S.description)}"><meta name="twitter:image" content="${S.siteUrl}og.jpg">
<link rel="icon" href="favicon.svg" type="image/svg+xml"><link rel="icon" href="favicon-32.png" sizes="32x32" type="image/png"><link rel="apple-touch-icon" href="apple-touch-icon.png"><link rel="manifest" href="site.webmanifest">
<link rel="preload" href="fonts/IBMPlexSansArabic-400-arabic.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="fonts/MarkaziText-700-arabic.woff2" as="font" type="font/woff2" crossorigin>
<style>${css}</style>
<script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body>
<a class="skip" href="#products">تخطَّ إلى المحتوى</a>
${defs}
<header class="hd"><div class="w hi">
 <a class="bd" href="#top" aria-label="${esc(S.brand)} - الصفحة الرئيسية"><svg class="lg" viewBox="0 0 48 48" aria-hidden="true"><circle cx="22" cy="27" r="19" fill="url(#gg)"/><text x="22" y="30" text-anchor="middle" font-size="33" font-weight="700" fill="#1B241A" style="font-family:'Markazi Text',serif">ع</text></svg>${esc(S.brand)}</a>
 <a class="btn sm" href="${gen}" target="_blank" rel="noopener">${WAI}اطلب عبر واتساب</a>
</div></header>
<main id="top">
<section class="hero"><svg class="bee" viewBox="0 0 56 56" aria-hidden="true"><ellipse class="wg" cx="26" cy="12" rx="10" ry="14" fill="#fff" fill-opacity=".75" stroke="#9DB095"/><ellipse cx="26" cy="31" rx="17" ry="12" fill="#F2C14E"/><path d="M19 20.5Q23 31 19 41.5M30 19.5Q34 31 30 42" stroke="#3A2A14" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="46" cy="29" r="8" fill="#3A2A14"/><circle cx="49" cy="27" r="2.2" fill="#fff"/><path d="M8 31L1 33L8 35Z" fill="#3A2A14"/></svg>
 <div class="w hg"><div><span class="k">${esc(S.hero.kicker)}</span><h1>${esc(S.hero.titleA)}<br>${esc(S.hero.titleB)} <b>${esc(S.hero.titleGold)}</b></h1><p>${esc(S.hero.text)}</p><a class="btn" href="#products">${esc(S.hero.cta)} ←</a></div>
 <div class="ar">${jar("#E0A93B","مرطبان عسل عسولة بغطاء من الخيش")}</div></div>
 <div class="liq" aria-hidden="true"><svg class="l1" viewBox="0 0 1200 90" preserveAspectRatio="none"><use href="#wp"/></svg><svg class="l2" viewBox="0 0 1200 90" preserveAspectRatio="none"><use href="#wp"/></svg><svg class="l3" viewBox="0 0 1200 90" preserveAspectRatio="none"><use href="#wp"/></svg></div>
</section>
<div class="band" aria-hidden="true"><div class="tr">${band}${band}</div></div>
<section class="sec" id="products"><div class="w"><span class="k">${esc(S.productsSection.kicker)}</span><h2>${esc(S.productsSection.title)}</h2><p class="mu" style="margin:0">${esc(S.productsSection.text)}</p>
 <nav class="chips" aria-label="أنواع العسل">${P.map(p=>`<a href="#${p.id}" style="--c:${p.color}"><i></i>${esc(p.name)}</a>`).join("")}</nav>
 <div class="cards">${P.map(card).join("")}</div>
 <p class="more">${esc(S.productsSection.more).replace("والمزيد من أنواع العسل الجبلي متوفر حسب الموسم.","<b>والمزيد من أنواع العسل الجبلي متوفر حسب الموسم.</b>")}</p></div></section>
<section class="sec vals"><div class="w"><span class="k">${esc(S.values.kicker)}</span><h2>${esc(S.values.title)}</h2><p class="mu" style="margin:0">${esc(S.values.text)}</p>
 <ul class="pts">${S.values.points.map(x=>`<li><b>${esc(x.title)}</b><span>${esc(x.text)}</span></li>`).join("")}</ul></div></section>
<section class="sec" aria-labelledby="hn"><div class="w"><p class="bx" id="hn"><strong>${esc(S.health.title)}:</strong> ${esc(S.health.text)} ${esc(S.health.readLabel)} ${S.health.links.map(l=>`<a href="${l.url}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join(" و")}.</p></div></section>
<section class="cta"><span class="k">${esc(S.cta.kicker)}</span><h2>${esc(S.cta.title)}</h2><p>${esc(S.cta.text)}</p><a class="btn" href="${ctaWa}" target="_blank" rel="noopener">${WAI}${esc(S.cta.button)}</a><small>${esc(S.cta.orPhone)} <a href="tel:+${S.whatsapp}">${esc(S.phoneDisplay)}</a></small></section>
</main>
<footer><div class="w fi"><span class="bd">${esc(S.brand)}</span><span>${esc(S.tagline)}</span><span>© ${new Date().getFullYear()} ${esc(S.brand)} · <details><summary>جميع الحقوق محفوظة</summary>جميع الحقوق محفوظة لـ <b>${esc(S.copyrightHolder)}</b></details></span></div></footer>
<a class="fab" href="${gen}" target="_blank" rel="noopener" aria-label="تواصل عبر واتساب">${WAI.replace('class="wa-i"','')}</a>
</body>
</html>`;
fs.mkdirSync(OUT,{recursive:true});
fs.writeFileSync(new URL("index.html",OUT),html);
fs.writeFileSync(new URL("robots.txt",OUT),`User-agent: *\nAllow: /\n\nSitemap: ${S.siteUrl}sitemap.xml\n`);
fs.writeFileSync(new URL("sitemap.xml",OUT),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${S.siteUrl}</loc><lastmod>${new Date().toISOString().slice(0,10)}</lastmod><changefreq>monthly</changefreq><priority>1.0</priority></url></urlset>\n`);
fs.writeFileSync(new URL("site.webmanifest",OUT),JSON.stringify({name:S.brand+" – عسل جبلي",short_name:S.brand,lang:"ar",dir:"rtl",start_url:"./",display:"standalone",background_color:"#F7F2E8",theme_color:"#1B241A",icons:[{src:"icon-192.png",sizes:"192x192",type:"image/png"},{src:"icon-512.png",sizes:"512x512",type:"image/png"}]}));
fs.writeFileSync(new URL("favicon.svg",OUT),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="#F3E3B0"/><stop offset="1" stop-color="#CDA85A"/></linearGradient></defs><circle cx="24" cy="24" r="23" fill="#1B241A"/><circle cx="24" cy="25" r="17" fill="url(#g)"/><text x="24" y="35" text-anchor="middle" font-size="30" font-weight="700" fill="#1B241A" font-family="serif">ع</text></svg>`);
console.log("built",(html.length/1024).toFixed(1)+"KB");
