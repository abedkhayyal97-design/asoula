// Usage: node tools/hd.js <url> <prefix> [dprs=1,2,3]  -> screenshots/hd-<prefix>-*.png (jar/bee/logo crops, reduced motion)
const P=require('/tmp/pp/node_modules/puppeteer-core');const w=ms=>new Promise(r=>setTimeout(r,ms));
const [,,URL,PRE,DP]=process.argv;const D='/workspace/asoula/screenshots/hd-';
(async()=>{const b=await P.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
for(const dpr of (DP||'1,2,3').split(',').map(Number))for(const [vn,vp] of [['desktop',{width:1366,height:850}],['mobile',{width:390,height:844,isMobile:true,hasTouch:true}]])for(const sc of ['light','dark']){
 const p=await b.newPage();await p.setViewport({...vp,deviceScaleFactor:dpr});await p.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'},{name:'prefers-color-scheme',value:sc}]);
 const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(URL,{waitUntil:'networkidle0'});await p.evaluate(()=>document.fonts.ready);await w(800);
 const tag=`${PRE}-${vn}-${sc}-dpr${dpr}`;
 const hj=await p.$('.hero .jar');await hj.screenshot({path:`${D}${tag}-herojar.png`});
 await (await p.$('#stage')).scrollIntoView?.();
 for(const i of [0,2]){await p.evaluate(i=>document.querySelectorAll('#tabs button')[i].click(),i);await w(500);await(await p.$('#pjar')).screenshot({path:`${D}${tag}-stagejar${i}.png`})}
 await p.evaluate(()=>scrollTo(0,0));await w(300);for(const [sel,nm] of [['#bee','bee'],['.lg','logo']]){const bb=await(await p.$(sel)).boundingBox();await p.screenshot({path:`${D}${tag}-${nm}.png`,clip:{x:bb.x-4,y:bb.y-4,width:bb.width+8,height:bb.height+8}})}
 if(dpr==3)await p.screenshot({path:`${D}${tag}-full.png`,fullPage:true});
 if(errs.length)console.log(tag,errs);await p.close()}
await b.close()})();
