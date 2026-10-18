// node tools/logo-shots.js <url> <prefix> : header + footer + first-viewport crops at DPR3 (desktop/mobile, light/dark)
const P=require('/tmp/pp/node_modules/puppeteer-core');const w=ms=>new Promise(r=>setTimeout(r,ms));
const [,,URL,PRE]=process.argv,D='/workspace/asoula/screenshots/logo-';
(async()=>{const b=await P.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
for(const [vn,vp] of [['desktop',{width:1366,height:850}],['mobile',{width:390,height:844,isMobile:true,hasTouch:true}]])for(const sc of ['light','dark']){
 const p=await b.newPage();await p.setViewport({...vp,deviceScaleFactor:3});await p.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'},{name:'prefers-color-scheme',value:sc}]);
 await p.goto(URL,{waitUntil:'networkidle0'});await p.evaluate(()=>document.fonts.ready);await w(800);
 await p.addStyleTag({content:'#bee,#bbl{display:none!important}'});
 const t=`${PRE}-${vn}-${sc}`;
 await p.screenshot({path:`${D}${t}-header.png`,clip:{x:0,y:0,width:vp.width,height:70}});
 await p.screenshot({path:`${D}${t}-top.png`,clip:{x:0,y:0,width:vp.width,height:vp.height}});
 await p.evaluate(()=>document.querySelector('footer').scrollIntoView({block:'end'}));await w(500);
 await(await p.$('footer')).screenshot({path:`${D}${t}-footer.png`});
 await p.close()}
await b.close()})();
