// plan-shots.js <baseUrl> <prefix>  -> per-section desktop+mobile screenshots + full pages
const P=require('/tmp/pp/node_modules/puppeteer-core');const U=process.argv[2].replace(/\/?$/,'/'),pre=process.argv[3]||'plan-';
const S='/workspace/asoula/screenshots/';const w=ms=>new Promise(r=>setTimeout(r,ms));
const sections=[['hero','#top'],['products','#products'],['why','#why'],['story','#story'],['compare','#compare'],['faq','#faq'],['cta','#contact'],['footer','footer']];
(async()=>{const b=await P.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
for(const [n,vp] of [['desktop',{width:1366,height:850,deviceScaleFactor:1}],['mobile',{width:390,height:844,deviceScaleFactor:2,isMobile:true,hasTouch:true}]]){
 const p=await b.newPage();await p.emulate({viewport:vp});await p.goto(U,{waitUntil:'networkidle0'});await w(1200);
 await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=400){scrollTo(0,y);await new Promise(r=>setTimeout(r,80))}scrollTo(0,0)});await w(500);
 await p.screenshot({path:S+pre+'home-'+n+'-full.png',fullPage:true});
 for(const [k,sel] of sections){const el=await p.$(sel);if(!el){console.log('missing',sel);continue}await el.evaluate(e=>e.scrollIntoView({block:'start'}));await w(350);
  const r=await el.boundingBox();await p.screenshot({path:S+pre+k+'-'+n+'.png',clip:{x:0,y:Math.max(0,r.y+await p.evaluate(()=>scrollY)),width:vp.width,height:Math.min(r.height,2600)}})}
 await p.close()}
await b.close()})();
