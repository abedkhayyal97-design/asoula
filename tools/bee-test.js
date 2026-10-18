// Interactive bee tests (pointer/touch/keyboard/reduced-motion) + screenshots bee-*.png
const P=require('/tmp/pp/node_modules/puppeteer-core');const w=ms=>new Promise(r=>setTimeout(r,ms));
const URL=process.argv[2]||'http://localhost:8800/',D='/workspace/asoula/screenshots/bee-';
const rect=(p,s)=>p.evaluate(s=>{const r=document.querySelector(s).getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height}},s);
const log=(...a)=>console.log(...a);
async function bubble(p){return p.evaluate(()=>{const b=document.getElementById('bbl');const r=b.getBoundingClientRect();return{on:b.classList.contains('on'),txt:b.innerText,x:r.x,y:r.y,w:r.width,h:r.height,iw:innerWidth,ih:innerHeight}})}
const inside=b=>b.x>=0&&b.y>=0&&b.x+b.w<=b.iw+.5&&b.y+b.h<=b.ih+.5;
async function waitFor(p,fn,ms){const t=Date.now();while(Date.now()-t<ms){if(await p.evaluate(fn))return true;await w(150)}return false}
(async()=>{const b=await P.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
for(const [vn,vp,touch] of [['desktop',{width:1366,height:850,deviceScaleFactor:2},0],['mobile',{width:390,height:844,deviceScaleFactor:3,isMobile:true,hasTouch:true},1]]){
 const p=await b.newPage();await p.setViewport(vp);const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>m.type()=='error'&&errs.push(m.text()));
 await p.goto(URL,{waitUntil:'networkidle0'});await w(1500);
 // 1 flying
 await p.screenshot({path:D+vn+'-flying.png'});
 // 2 catch (pointer/touch) while flying
 let mode0=await p.evaluate(()=>document.getElementById('bee').className);
 const R=await rect(p,'#bee');const cx=R.x+R.w/2,cy=R.y+R.h/2;
 if(touch){await p.touchscreen.touchStart(cx,cy)}else{await p.mouse.move(cx,cy);await p.mouse.down()}
 await w(500);let bb=await bubble(p);
 const held=await rect(p,'#bee');
 await p.screenshot({path:D+vn+'-caught-bubble.png'});
 if(touch)await p.touchscreen.touchEnd();else await p.mouse.up();
 log(vn,'caught bubble:',bb.on,JSON.stringify(bb.txt),'inside viewport:',inside(bb),'bee class',await p.evaluate(()=>document.getElementById('bee').className));
 const ay=await p.evaluate(()=>document.getElementById('bbl').getAttribute('aria-live')+'/'+document.getElementById('bbl').getAttribute('role'));log(' aria',ay);
 await w(4800);bb=await bubble(p);log(' after release: bubble on?',bb.on,'| bee class',await p.evaluate(()=>document.getElementById('bee').className));
 // 3 perch: scroll so flowers visible then wait
 if(touch){await p.evaluate(()=>document.querySelector('#products').scrollIntoView({block:'end'}));}
 else await p.evaluate(()=>scrollTo(0,0));
 await w(300);
 const landed=await waitFor(p,()=>document.getElementById('bee').classList.contains('pr'),50000);log(' landed on flower:',landed);
 if(landed){await w(1200);await p.screenshot({path:D+vn+'-perched.png'});
  const R2=await rect(p,'#bee');const fx=R2.x+R2.w/2,fy=R2.y+R2.h/2;
  if(touch){await p.touchscreen.tap(fx,fy)}else{await p.mouse.click(fx,fy)}
  await w(500);bb=await bubble(p);log(' perched-caught bubble:',bb.on,JSON.stringify(bb.txt),'inside:',inside(bb));await p.screenshot({path:D+vn+'-perched-caught-bubble.png'});
  await w(5200);bb=await bubble(p);log(' later bubble on?',bb.on,'mode',await p.evaluate(()=>document.getElementById('bee').className));
 }
 // keyboard
 await p.focus('#bee');await p.keyboard.press('Enter');await w(400);bb=await bubble(p);log(' keyboard Enter bubble:',bb.on,JSON.stringify(bb.txt));
 await p.keyboard.press('Escape');await w(400);log(' Escape closes:',!(await bubble(p)).on);
 log(' errors:',JSON.stringify(errs));await p.close();
}
// reduced motion
for(const [vn,vp,touch] of [['desktop',{width:1366,height:850,deviceScaleFactor:2},0],['mobile',{width:390,height:844,deviceScaleFactor:3,isMobile:true,hasTouch:true},1]]){
 const p=await b.newPage();await p.setViewport(vp);await p.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(URL,{waitUntil:'networkidle0'});await w(800);
 if(touch)await p.evaluate(()=>document.querySelector('#products').scrollIntoView({block:'end'}));await w(600);
 const c1=await p.evaluate(()=>document.getElementById('bee').className),r1=await rect(p,'#bee');await w(1500);const r2=await rect(p,'#bee');
 log('RM',vn,'class',c1,'static:',r1.x==r2.x&&r1.y==r2.y,JSON.stringify(r1));await p.screenshot({path:D+vn+'-reduced-motion-perched.png'});
 const fx=r1.x+r1.w/2,fy=r1.y+r1.h/2;if(touch)await p.touchscreen.tap(fx,fy);else await p.mouse.click(fx,fy);await w(500);const bb=await bubble(p);log('RM bubble',bb.on,JSON.stringify(bb.txt),inside(bb));await p.screenshot({path:D+vn+'-reduced-motion-bubble.png'});log(' errors',JSON.stringify(errs));await p.close()}
await b.close()})();
