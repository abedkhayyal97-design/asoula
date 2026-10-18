// Side-by-side visual comparison: original (Netlify) vs new. Usage: node tools/compare.js <newUrl>
const P=require('/tmp/pp/node_modules/puppeteer-core'),fs=require('fs');
const ORIG='https://aasolabrand1.netlify.app/',NEW=process.argv[2]||'http://localhost:8800/';const D='/workspace/asoula/screenshots/';const w=ms=>new Promise(r=>setTimeout(r,ms));
async function run(b,url,isOrig,vp,scheme,steps){const p=await b.newPage();await p.emulate({viewport:vp});await p.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'},{name:'prefers-color-scheme',value:scheme}]);
 if(isOrig){await p.setRequestInterception(true);p.on('request',r=>/netlify\/scripts/.test(r.url())?r.abort():r.continue())}
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>m.type()=='error'&&errs.push(m.text()));
 await p.goto(url,{waitUntil:'networkidle0'});await p.evaluate(()=>document.fonts.ready);await w(1200);const out={};
 const getMasks=()=>p.evaluate(()=>{const R=[];for(const [s,pad] of [['.jar',60],['.lg',10],['.fw',6],['#bee',8],['#bbl',8]])document.querySelectorAll(s).forEach(e=>{const r=e.getBoundingClientRect();if(r.width)R.push([r.left-pad,r.top+scrollY-pad,r.right+pad,r.bottom+scrollY+pad])});R.push([innerWidth-80-8,90-8,innerWidth-80+56,90+56]);return R});const masks={};
 for(const [name,fn] of steps){await fn(p);await w(700);await p.evaluate(()=>scrollTo(0,0));out[name]=await p.screenshot({fullPage:true});masks[name]=await getMasks()}
 await p.close();return {out,errs,masks}}
const tabStep=i=>async p=>{await p.evaluate(i=>document.querySelectorAll('#tabs button')[i].click(),i);await w(600)};
const steps=[['tab0',async()=>{}],['tab1',tabStep(1)],['tab2',tabStep(2)],['tab3',tabStep(3)],['popup',async p=>{await tabStep(0)(p);await p.evaluate(()=>document.getElementById('cb').click())}]];
(async()=>{const b=await require('/tmp/pp/node_modules/puppeteer-core').launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const cfgs=[];for(const [vn,vp] of [['desktop',{width:1366,height:850}],['mobile',{width:390,height:844,deviceScaleFactor:1,isMobile:true,hasTouch:true}]])for(const sc of ['light','dark'])cfgs.push([vn,vp,sc]);
 const report=[];
 for(const [vn,vp,sc] of cfgs){const o=await run(b,ORIG,true,vp,sc,steps),n=await run(b,NEW,false,vp,sc,steps);
  for(const [name] of steps){const f=`${vn}-${sc}-${name}`;fs.writeFileSync(D+'cmp-orig-'+f+'.png',o.out[name]);fs.writeFileSync(D+'cmp-new-'+f+'.png',n.out[name])}
  for(const [name] of steps)fs.writeFileSync(`/tmp/mask-${vn}-${sc}-${name}.json`,JSON.stringify(n.masks[name]));report.push({vn,sc,errsOrig:o.errs,errsNew:n.errs})}
 fs.writeFileSync('/tmp/cmp_report.json',JSON.stringify(report));await b.close();console.log(JSON.stringify(report))})();
