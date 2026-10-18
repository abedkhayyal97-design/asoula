// audit.js <baseUrl>: privacy facts (cookies/storage/3rd-party requests/forms), heading hierarchy, SEO tags, JSON-LD
const P=require('/tmp/pp/node_modules/puppeteer-core');const U=process.argv[2].replace(/\/?$/,'/');
(async()=>{const b=await P.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const sm=await (await fetch(U+'sitemap.xml')).text();const locs=[...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);const prod=locs[0];
for(const l of locs){const url=U+l.slice(prod.length);const p=await b.newPage();const reqs=new Set();p.on('request',r=>reqs.add(new URL(r.url()).origin));
 await p.goto(url,{waitUntil:'networkidle0'});await new Promise(r=>setTimeout(r,600));
 const d=await p.evaluate(()=>{const hs=[...document.querySelectorAll('h1,h2,h3,h4')].map(h=>+h.tagName[1]);let skip=false;for(let i=1;i<hs.length;i++)if(hs[i]-hs[i-1]>1)skip=true;
  const ld=[...document.querySelectorAll('script[type="application/ld+json"]')].map(s=>{try{return JSON.parse(s.textContent)}catch{return 'INVALID'}});
  const q=s=>document.querySelector(s)?.getAttribute('content')||document.querySelector(s)?.getAttribute('href');
  return{h1:hs.filter(x=>x==1).length,skip,title:document.title,desc:q('meta[name=description]'),canon:q('link[rel=canonical]'),og:q('meta[property="og:image"]'),ogt:q('meta[property="og:title"]'),forms:document.querySelectorAll('form:not([method=dialog])').length,inputsText:document.querySelectorAll('input[type=text],input[type=email],input[type=tel],textarea').length,imgNoAlt:[...document.images].filter(i=>!i.hasAttribute('alt')).length,imgNoDim:[...document.images].filter(i=>!(i.getAttribute('width')&&i.getAttribute('height'))).length,ls:localStorage.length,ss:sessionStorage.length,ldTypes:ld.map(x=>Array.isArray(x)?x.map(y=>y['@type']).join('+'):x['@type']),ldOffers:JSON.stringify(ld).includes('offers')||JSON.stringify(ld).includes('"price"'),scripts:[...document.scripts].filter(s=>s.src).length}});
 const ck=(await p.cookies()).length;const origins=[...reqs].filter(o=>o!==new URL(U).origin&&!o.startsWith('data:'));
 console.log(l.slice(prod.length)||'/', JSON.stringify({...d,cookies:ck,thirdPartyRequests:origins}));await p.close()}
await b.close()})();
