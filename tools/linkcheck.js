// linkcheck.js <baseUrl>  - crawls every page from the sitemap, checks internal links/assets/anchors (and external links with GET)
const U=process.argv[2].replace(/\/?$/,'/');const seen=new Set(),bad=[],ext=new Map(),pages=new Map();let n=0;
const get=async(u,o={})=>{const c=new AbortController();const t=setTimeout(()=>c.abort(),20000);try{return await fetch(u,{redirect:'follow',signal:c.signal,headers:{'user-agent':'Mozilla/5.0 asoula-linkcheck'},...o})}finally{clearTimeout(t)}};
(async()=>{const sm=await (await get(U+'sitemap.xml')).text();const locs=[...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
 // sitemap lists production URLs: map them onto the tested base
 const prod=locs[0];const todo=locs.map(l=>U+l.slice(prod.length));
 for(const pu of todo){const r=await get(pu);const html=await r.text();n++;if(!r.ok){bad.push([pu,'page '+r.status]);continue}pages.set(pu,html)}
 const idsOf=h=>new Set([...h.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]));
 for(const [pu,html] of pages){
  const refs=[];for(const m of html.matchAll(/\s(?:href|src|poster|data-src)="([^"]*)"/g))refs.push(m[1]);
  for(const m of html.matchAll(/(?:srcset|imagesrcset)="([^"]*)"/g))m[1].split(',').forEach(x=>refs.push(x.trim().split(/\s+/)[0]));
  for(const raw of new Set(refs)){if(!raw||/^(data:|javascript:|mailto:|tel:)/.test(raw))continue;
   let u;try{u=new URL(raw.replace(/&amp;/g,'&'),pu)}catch{bad.push([pu,'bad url '+raw]);continue}
   if(u.origin!==new URL(U).origin){ext.set(u.href.split('#')[0],pu);continue}
   const key=u.origin+u.pathname;let st=seen.has(key)?null:'new';
   if(st){const r=await get(key,{method:'GET'});seen.add(key);if(!r.ok)bad.push([pu,raw+' -> '+r.status]);n++}
   if(u.hash&&u.hash.length>1){const tgt=pages.get(key)||pages.get(key+'/')||pages.get(key.replace(/\/?$/,'/'));if(tgt&&!idsOf(tgt).has(decodeURIComponent(u.hash.slice(1))))bad.push([pu,'missing anchor '+raw])}}}
 for(const [e,from] of ext){try{let r=await get(e);if(!r.ok&&![403,429,999].includes(r.status))bad.push([from,'EXTERNAL '+e+' -> '+r.status]);else console.log('ext',r.status,e.slice(0,90))}catch(x){bad.push([from,'EXTERNAL '+e+' -> '+x.message])}}
 console.log('pages',pages.size,'resources/links checked',n,'external',ext.size);console.log(bad.length?'BROKEN:\n'+bad.map(b=>b.join('  ')).join('\n'):'NO BROKEN LINKS');})();
