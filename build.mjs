// Builds docs/index.html from src/original.html (the original design/CSS/JS, unchanged visually)
// + invisible improvements: self-hosted fonts, minification, SEO meta/schema, prerendered honey explorer, a11y attributes.
// Run: node build.mjs        (SITE_URL=https://yourdomain.com/ node build.mjs)
import fs from "node:fs";import crypto from "node:crypto";import {createRequire} from "node:module";
const require=createRequire(import.meta.url);
let esb=null;for(const p of ["esbuild","/tmp/pp/node_modules/esbuild"]){try{esb=require(p);break}catch{}}
const rd=f=>fs.readFileSync(new URL(f,import.meta.url),"utf8");
const S=JSON.parse(rd("data/site.json")),P=JSON.parse(rd(process.env.PRODUCTS_JSON||"data/products.json"));
const OGV=crypto.createHash("md5").update(fs.readFileSync(new URL("docs/og.jpg",import.meta.url))).digest("hex").slice(0,8); // cache-bust for WhatsApp/Facebook previews
if(process.env.SITE_URL)S.siteUrl=process.env.SITE_URL.replace(/\/?$/,"/");
import {ALL_DEFS,DEFS,J,BEE,LOGO,flower} from "./src/art.mjs";
import * as PG from "./src/pages.mjs";
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
let h=rd("src/original.html");
// 1) remove Netlify injected comment + analytics/HUD script (outside the design)
h=h.replace(/<!-- This site is hosted on Netlify[\s\S]*?-->\s*/,"").replace(/\s*<script async src="\/\.netlify[^>]*><\/script>\s*$/,"\n");
h=h.replace(/<\/html>\s*$/,"")+"</html>\n";
// 1b) HD artwork (jar/bee/logo): same viewBoxes/composition/colours, far more detail (src/art.mjs)
h=h.replace(/(<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>)[\s\S]*?(<\/defs><\/svg>)/,(m,a,b)=>a+ALL_DEFS().replace(/>\s*\n\s*</g,"><").replace(/\n/g,"")+b);
// prerender both jars in the HTML (painted with first paint, no JS needed); the JS no longer injects them
h=h.replace(/const J='[^\n]*';\n/,"").replace('document.querySelectorAll(".jar").forEach(s=>s.innerHTML=J);\n',"");
h=h.replace(/(<svg class="jar" viewBox="0 0 200 260" role="img"[^>]*>)(<\/svg>)/,(m,a,b)=>a+J+b).replace(/(<svg class="jar" id="pjar"[^>]*>)(<\/svg>)/,(m,a,b)=>a+J+b);
h=h.replace(/<div id="bee" aria-hidden="true"><svg[\s\S]*?<\/svg><\/div>\s*/,"");
h=h.replace('<dialog id="cr">','<div id="bee" role="button" tabindex="0" aria-label="نحلة عسولة الطائرة، اضغط Enter لتمسك بها">'+BEE+'</div>\n<div id="bbl" role="status" aria-live="polite"></div>\n<dialog id="cr">');
const FLW=(a)=>a.map(([t,st])=>flower(t,st)).join("");
h=h.replace('<div class="liq" aria-hidden="true">',m=>m);
h=h.replace(/(<\/svg><\/div>\n<\/section>\n\n<div class="band")/,(m,a)=>"</svg></div>\n"+FLW([["fa","left:2.5%;--w:54px;--b:34px"],["fc","left:9%;--w:42px;--b:36px;--d:-2s"],["fb","right:3%;--w:56px;--b:34px;--d:-1s"],["fa","right:10%;--w:40px;--b:38px;--d:-3s"]])+"\n</section>\n\n<div class=\"band\"");
h=h.replace(/(<\/div><\/section>\n\n<section class="sec" style="background:var\(--pp\)">)/,(m,a)=>FLW([["fb","left:3%;--w:36px;--b:4px;--d:-1.5s"],["fc","right:3%;--w:36px;--b:4px;--d:-.5s"]])+a);

// brand logo (traced vector from the supplied brand image) replaces the old mark + wordmark in header and footer
h=h.replace(/(<a class="bd" href="#top") aria-label="[^"]*">\s*<svg class="lg"[\s\S]*?<\/svg>عسولة<\/a>/,(m,a)=>a+'><picture><source type="image/webp" srcset="logo-dark-110.webp 1x, logo-dark-220.webp 2x, logo-dark-330.webp 3x"><img class="lg" src="logo-dark-220.png" width="110" height="50" alt="عسولة – عسل جبلي (الصفحة الرئيسية)" decoding="async" fetchpriority="high"></picture></a>');
h=h.replace('<span class="bd">عسولة</span>','<span class="bd"><picture><source type="image/webp" srcset="logo-dark-75.webp 1x, logo-dark-150.webp 2x, logo-dark-225.webp 3x"><img class="lf" src="logo-dark-150.png" width="75" height="34" alt="شعار عسولة: اسم عسولة بالخط العربي مع نحلة وقطرة عسل" loading="lazy" decoding="async"></picture></span>');

// ===== MASTER PLAN additions =====
const LG_H='<picture><source type="image/webp" srcset="logo-dark-110.webp 1x, logo-dark-220.webp 2x, logo-dark-330.webp 3x"><img class="lg" src="logo-dark-220.png" width="110" height="50" alt="عسولة – عسل جبلي (الصفحة الرئيسية)" decoding="async" fetchpriority="high"></picture>';
const LG_F='<picture><source type="image/webp" srcset="logo-dark-75.webp 1x, logo-dark-150.webp 2x, logo-dark-225.webp 3x"><img class="lf" src="logo-dark-150.png" width="75" height="34" alt="شعار عسولة: اسم عسولة بالخط العربي مع نحلة وقطرة عسل" loading="lazy" decoding="async"></picture>';
const withBase=(x,b)=>x.replace(/(srcset|src)="(logo-dark-[^"]+)"/g,(m,a,v)=>a+'="'+v+'"').replace(/srcset="([^"]+)"/g,(m,v)=>'srcset="'+v.split(", ").map(t=>b+t).join(", ")+'"').replace(/ src="logo-/g,' src="'+b+'logo-');
const hdr=(b,home)=>PG.header(S,b,home).replace(">LOGO<",">"+withBase(LG_H,b)+"<");
const ftr=(b,home)=>PG.footer(S,P,b,home).replace(">FLOGO<",">"+withBase(LG_F,b)+"<");
const FW=a=>a.map(([t,st])=>flower(t,st)).join("");
h=h.replace("<main>",'<a class="skip" href="#main">تخطَّ إلى المحتوى</a>\n<main id="main">');
// hero: two buttons
h=h.replace('<a class="btn" href="#products">اكتشف أنواعنا ←</a>',`<div class="hb"><a class="btn" href="#products">${S.heroButtons.primary} ←</a><a class="btn ol" href="#story">${S.heroButtons.secondary}</a></div>`);
// products: card grid before the (kept) tabbed explorer
h=h.replace('وما يُعرف به تقليدياً ولمن يناسب.</p>',m=>m+PG.productCards(S,P,J,"")+'\n <h3 class="sh">استكشف كل نوع بالتفصيل</h3>');
h=h.replace('<a class="btn" id="ord" target="_blank" rel="noopener" href="#">اطلب هذا النوع ↗</a>',m=>m+' <a class="xl" id="pgl" href="honey/'+P[0].slug+'/">صفحة المنتج الكاملة ←</a>');
h=h.replace('$("ord").href=mk("عسل "+h.n);','$("ord").href=mk("عسل "+h.n);$("pgl").href="honey/"+h.u+"/";');
// everything after the products section -> new sections (+ kept health box and CTA)
{const i=h.indexOf('<section class="sec" style="background:var(--pp)">'),j=h.indexOf("</main>");
 const tail=[PG.whySection(S),PG.storySection(S,J),PG.compareSection(S,P),PG.faqSection(S),PG.healthBox(S),PG.ctaSection(S,"")].join("\n\n")
  .replace("<!--FW:story-->",FW([["fa","left:3%;--w:36px;--b:4px;--d:-2.5s"],["fb","right:3%;--w:36px;--b:4px;--d:-3.5s"]]))
  .replace("<!--FW:cta-->",FW([["fc","left:4%;--w:56px;--b:0;--d:-1s"],["fa","left:12%;--w:40px;--b:0;--d:-2s"],["fb","right:5%;--w:56px;--b:0;--d:-3s"]]));
 h=h.slice(0,i)+tail+"\n"+h.slice(j);}
h=h.replace(/<header class="hd">[\s\S]*?<\/header>/,hdr("",true));
h=h.replace(/<footer>[\s\S]*?<\/footer>/,ftr("",true));
h=h.replace(/<dialog id="cr">[\s\S]*?<\/dialog>/,PG.dialog(S));
// 2) fonts: replace Google Fonts with self-hosted subsets (same families/weights)
h=h.replace(/<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">[\s\S]*?display=swap">\s*/,
 '<link rel="preload" as="image" type="image/webp" href="logo-dark-220.webp" imagesrcset="logo-dark-110.webp 1x, logo-dark-220.webp 2x, logo-dark-330.webp 3x" fetchpriority="high">\n<link rel="preload" href="fonts/IBMPlexSansArabic-400-arabic.woff2" as="font" type="font/woff2" crossorigin>\n<link rel="preload" href="fonts/MarkaziText-700-arabic.woff2" as="font" type="font/woff2" crossorigin>\n');
let CSS="";
// 3) CSS: prepend font-faces, minify
h=h.replace(/<style>([\s\S]*?)<\/style>/,(m,css)=>{css=rd("fonts.css")+"\n"+css+"\n"+rd("src/extra.css");if(esb)css=esb.transformSync(css,{loader:"css",minify:true}).code;CSS=css;return "<style>"+css+"</style>"});
// 4) honey data from JSON (same short keys as the original script)
const Hs=P.map(p=>({u:p.slug,n:p.name,c:p.color,d:p.desc,t:p.taste,s:p.season,b:p.benefits,w:p.for,p:p.prevents}));
h=h.replace(/const H=\[[\s\S]*?\}\];/,"const H="+JSON.stringify(Hs)+";");
// 5) JS: avoid duplicating prerendered tabs; keyboard + aria (invisible)
h=h.replace("H.forEach((h,i)=>{const b=document.createElement(\"button\");b.setAttribute(\"role\",\"tab\");","tabs.textContent=\"\";H.forEach((h,i)=>{const b=document.createElement(\"button\");b.setAttribute(\"role\",\"tab\");b.setAttribute(\"aria-controls\",\"stage\");b.type=\"button\";");
h=h.replace("b.onclick=()=>{show(i);toJar()};tabs.appendChild(b)});","b.onclick=()=>{show(i);toJar()};tabs.appendChild(b)});tabs.addEventListener(\"keydown\",e=>{const k=e.key==\"ArrowLeft\"?1:e.key==\"ArrowRight\"?-1:0;if(!k)return;const t=[...tabs.children],i=t.indexOf(document.activeElement);if(i<0)return;e.preventDefault();const n=t[(i+k+t.length)%t.length];n.focus();n.click()});");
// 6) prerender the explorer in its initial state (JS re-renders identically) so crawlers / no-JS see the content
const L=a=>a.map(x=>"<li>"+esc(x)+"</li>").join("");
const wa=(x)=>"https://wa.me/"+S.whatsapp+"?text="+encodeURIComponent("مرحباً عسولة، أريد الاستفسار عن: "+x);
const f=P[0];
h=h.replace('<div class="tabs" id="tabs" role="tablist" aria-label="أنواع العسل"></div>','<div class="tabs" id="tabs" role="tablist" aria-label="أنواع العسل">'+P.map((p,i)=>`<button role="tab" type="button" aria-controls="stage" aria-selected="${i==0}" style="--c:${p.color}"><i></i>${esc(p.name)}</button>`).join("")+"</div>");
h=h.replace('<section class="stage" id="stage" aria-live="polite">','<section class="stage" id="stage" role="tabpanel" aria-live="polite" style="--c:'+f.color+'">');
h=h.replace('<h3 id="name"></h3><p class="mu" id="desc"></p>','<h3 id="name">عسل '+esc(f.name)+'</h3><p class="mu" id="desc">'+esc(f.desc)+"</p>");
h=h.replace('<div class="ch"><b id="taste"></b><b id="season"></b></div>','<div class="ch"><b id="taste">'+esc(f.taste)+'</b><b id="season">القطاف: '+esc(f.season)+"</b></div>");
h=h.replace('<ul id="ben"></ul>','<ul id="ben">'+L(f.benefits)+"</ul>").replace('<ul id="who"></ul>','<ul id="who">'+L(f.for)+"</ul>").replace('<ul id="prev"></ul>','<ul id="prev">'+L(f.prevents)+"</ul>");
h=h.replace('id="ord" target="_blank" rel="noopener" href="#"','id="ord" target="_blank" rel="noopener" href="'+wa("عسل "+f.name)+'"');
// static WhatsApp links (JS sets the same ones; no dead "#" links without JS)
h=h.replace(/data-wa="([^"]+)" target="_blank" rel="noopener" href="#"/g,(m,x)=>`data-wa="${x}" target="_blank" rel="noopener" href="${wa(x)}"`);
h=h.replace('wa="963997883618"','wa="'+S.whatsapp+'"');
h=h.replace(/const bee=\$\("bee"\);[\s\S]*?(?=\n<\/script>)/,()=>rd("src/bee.js")+"\n"+rd("src/menu.js"));
// 7) JS minify
h=h.replace(/<script>([\s\S]*?)<\/script>/,(m,js)=>"<script>"+(esb?esb.transformSync(js,{minify:true}).code:js)+"</script>");
// 8) head: SEO / social / icons / structured data (not visible)
const desc=S.description;
const ld=[{"@context":"https://schema.org","@type":"Organization","name":S.brand,"url":S.siteUrl,"slogan":S.tagline,"telephone":S.phoneDisplay.replace(/\s/g,""),"logo":S.siteUrl+"icon-512.png","contactPoint":{"@type":"ContactPoint","telephone":S.phoneDisplay.replace(/\s/g,""),"contactType":"sales","availableLanguage":"Arabic"}},
{"@context":"https://schema.org","@type":"WebSite","name":S.brand,"url":S.siteUrl,"inLanguage":"ar"},
{"@context":"https://schema.org","@type":"ItemList","name":"عسل جبلي بكافة أنواعه","itemListElement":P.map((p,i)=>({"@type":"ListItem","position":i+1,"item":{"@type":"Product","name":"عسل "+p.name,"url":S.siteUrl+"honey/"+p.slug+"/","description":p.desc+" الطعم: "+p.taste+". القطاف: "+p.season+".","brand":{"@type":"Brand","name":S.brand}}}))}];
const head=`<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${S.siteUrl}">
<meta property="og:type" content="website"><meta property="og:locale" content="ar_SY"><meta property="og:site_name" content="${esc(S.brand)}"><meta property="og:title" content="${esc(S.title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${S.siteUrl}"><meta property="og:image" content="${S.siteUrl}og.jpg?v=${OGV}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="شعار عسولة – عسل جبلي أصيل">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(S.title)}"><meta name="twitter:description" content="${esc(desc)}"><meta name="twitter:image" content="${S.siteUrl}og.jpg?v=${OGV}">
<link rel="icon" href="favicon.svg" type="image/svg+xml"><link rel="icon" href="favicon.ico" sizes="any"><link rel="icon" href="favicon-32.png" sizes="32x32" type="image/png"><link rel="apple-touch-icon" href="apple-touch-icon.png"><link rel="manifest" href="site.webmanifest">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
`;
h=h.replace(/(<title>[^<]*<\/title>\n)/,"$1"+head);
const OUT=process.env.OUT_DIR?new URL("file://"+process.env.OUT_DIR.replace(/\/?$/,"/")):new URL("docs/",import.meta.url);fs.mkdirSync(OUT,{recursive:true});
fs.writeFileSync(new URL("index.html",OUT),h);
fs.writeFileSync(new URL("robots.txt",OUT),`User-agent: *\nAllow: /\n\nSitemap: ${S.siteUrl}sitemap.xml\n`);
const today=new Date().toISOString().slice(0,10);
const smUrls=[["",1.0],...P.map(p=>["honey/"+p.slug+"/",0.8]),["privacy/",0.3]];
fs.writeFileSync(new URL("sitemap.xml",OUT),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${smUrls.map(([u,pr])=>`<url><loc>${S.siteUrl}${u}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>${pr}</priority></url>`).join("")}</urlset>\n`);
fs.writeFileSync(new URL("site.webmanifest",OUT),JSON.stringify({name:S.brand+" – عسل جبلي",short_name:S.brand,lang:"ar",dir:"rtl",start_url:"./",display:"standalone",background_color:"#F7F2E8",theme_color:"#1B241A",icons:[{src:"icon-192.png",sizes:"192x192",type:"image/png",purpose:"any"},{src:"icon-512.png",sizes:"512x512",type:"image/png",purpose:"any"},{src:"icon-1024.png",sizes:"1024x1024",type:"image/png",purpose:"any"},{src:"icon-maskable-512.png",sizes:"512x512",type:"image/png",purpose:"maskable"},{src:"favicon.svg",sizes:"any",type:"image/svg+xml"}]}));

// ===== static sub-pages: /honey/<slug>/ and /privacy/ =====
const JS_SUB=(esb?(c=>esb.transformSync(c,{minify:true}).code):(c=>c))(rd("src/menu.js")+'\n(()=>{const y=document.getElementById("yr"),c=document.getElementById("cb"),d=document.getElementById("cr");if(y)y.textContent=new Date().getFullYear();if(c&&d)c.addEventListener("click",()=>d.showModal())})();\n'+rd("src/product.js"));
function shell({title,desc,path,base,body,ld,ogAlt}){
 const url=S.siteUrl+path;
 const css=CSS.replace(/url\(fonts\//g,"url("+base+"fonts/");
 return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#1B241A">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<link rel="preload" as="image" type="image/webp" href="${base}logo-dark-220.webp" imagesrcset="${base}logo-dark-110.webp 1x, ${base}logo-dark-220.webp 2x, ${base}logo-dark-330.webp 3x" fetchpriority="high">
<link rel="preload" href="${base}fonts/IBMPlexSansArabic-400-arabic.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${base}fonts/MarkaziText-700-arabic.woff2" as="font" type="font/woff2" crossorigin>
<meta property="og:type" content="website"><meta property="og:locale" content="ar_SY"><meta property="og:site_name" content="${esc(S.brand)}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${S.siteUrl}og.jpg?v=${OGV}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${esc(ogAlt||"شعار عسولة – عسل جبلي أصيل")}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(desc)}"><meta name="twitter:image" content="${S.siteUrl}og.jpg?v=${OGV}">
<link rel="icon" href="${base}favicon.svg" type="image/svg+xml"><link rel="icon" href="${base}favicon.ico" sizes="any"><link rel="icon" href="${base}favicon-32.png" sizes="32x32" type="image/png"><link rel="apple-touch-icon" href="${base}apple-touch-icon.png"><link rel="manifest" href="${base}site.webmanifest">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<style>${css}</style>
</head>
<body>
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>${DEFS().replace(/>\s*\n\s*</g,"><").replace(/\n/g,"")}</defs></svg>
<a class="skip" href="#main">تخطَّ إلى المحتوى</a>
${hdr(base,false)}
${body}
${ftr(base,false)}
${PG.dialog(S)}
<script>${JS_SUB}</script>
</body>
</html>
`}
const crumb=(items)=>({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":items.map(([n,u],i)=>({"@type":"ListItem","position":i+1,"name":n,"item":S.siteUrl+u}))});
for(const p of P){
 const base="../../",nm="عسل "+p.name;
 const body=PG.productPage(S,P,p,J,base).replace(/__BASE__/g,base);
 const desc=`${nm}: ${p.desc} الطعم: ${p.taste}. القطاف: ${p.season}. اطلبه عبر واتساب من عسولة.`;
 const ld=[{"@context":"https://schema.org","@type":"Product","name":nm,"description":p.desc+" الطعم: "+p.taste+". القطاف: "+p.season+".","brand":{"@type":"Brand","name":S.brand},"url":S.siteUrl+"honey/"+p.slug+"/",...(p.photo&&p.photo.src?{"image":S.siteUrl+p.photo.src}:{})},crumb([["الرئيسية",""],["أنواع العسل","#products"],[nm,"honey/"+p.slug+"/"]])];
 const dir=new URL("honey/"+p.slug+"/",OUT);fs.mkdirSync(dir,{recursive:true});
 fs.writeFileSync(new URL("index.html",dir),shell({title:nm+" | عسولة",desc,path:"honey/"+p.slug+"/",base,body,ld,ogAlt:nm+" – عسولة"}));
}
{const base="../";fs.mkdirSync(new URL("privacy/",OUT),{recursive:true});
 fs.writeFileSync(new URL("privacy/index.html",OUT),shell({title:"سياسة الخصوصية | عسولة",desc:"سياسة الخصوصية في موقع عسولة: لا نجمع بيانات شخصية، والطلبات تتم عبر واتساب.",path:"privacy/",base,body:PG.privacyPage(S),ld:[crumb([["الرئيسية",""],["سياسة الخصوصية","privacy/"]])]}));}
console.log("built",(h.length/1024).toFixed(1)+"KB",esb?"(minified)":"(NOT minified)");
