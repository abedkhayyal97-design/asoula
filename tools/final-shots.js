const P=require('/tmp/pp/node_modules/puppeteer-core');const U=process.argv[2],pre=process.argv[3]||'logo-final-local-';
const S='/workspace/asoula/screenshots/';
(async()=>{const b=await P.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const cfgs=[['desktop-light',{width:1366,height:850,deviceScaleFactor:1},'light'],['desktop-dark',{width:1366,height:850,deviceScaleFactor:1},'dark'],['mobile-light-dpr3',{width:390,height:844,deviceScaleFactor:3,isMobile:true,hasTouch:true},'light'],['mobile-dark-dpr3',{width:390,height:844,deviceScaleFactor:3,isMobile:true,hasTouch:true},'dark']];
for(const [n,vp,cs] of cfgs){const p=await b.newPage();await p.emulate({viewport:vp});await p.emulateMediaFeatures([{name:'prefers-color-scheme',value:cs}]);
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>m.type()=='error'&&errs.push(m.text()));p.on('requestfailed',r=>errs.push('REQFAIL '+r.url()));p.on('response',r=>{if(r.status()>=400)errs.push(r.status()+' '+r.url())});
let cls=0;await p.evaluateOnNewDocument(()=>{window.__cls=0;new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.__cls+=e.value}).observe({type:'layout-shift',buffered:true})});
await p.goto(U,{waitUntil:'load'});await new Promise(r=>setTimeout(r,2000));
await p.screenshot({path:S+pre+n+'-top.png'});
const info=await p.evaluate(()=>{const i=document.querySelector('.hd .lg'),h=document.querySelector('.hd');const r=i.getBoundingClientRect();return {hdH:h.getBoundingClientRect().height,imgW:r.width,imgH:r.height,cur:i.currentSrc.split('/').pop(),nat:i.naturalWidth,cls:window.__cls}});
// header close-up
await p.screenshot({path:S+pre+n+'-header.png',clip:{x:0,y:0,width:vp.width,height:90}});
await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=500){scrollTo(0,y);await new Promise(r=>setTimeout(r,100))}scrollTo(0,document.body.scrollHeight)});await new Promise(r=>setTimeout(r,700));
await p.screenshot({path:S+pre+n+'-footer.png'});
const f=await p.evaluate(()=>{const i=document.querySelector('.fi .lf');const r=i.getBoundingClientRect();return {w:r.width,h:r.height,cur:i.currentSrc.split('/').pop(),loaded:i.complete&&i.naturalWidth>0}});
console.log(n,JSON.stringify(info),JSON.stringify(f),'errors',JSON.stringify(errs));await p.close()}
await b.close()})();
