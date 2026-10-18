const P=require('/tmp/pp/node_modules/puppeteer-core');const [,, url, out]=process.argv;const S='/workspace/asoula/screenshots/';
(async()=>{const b=await P.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
for(const [n,vp] of [['desktop',{width:1366,height:850,deviceScaleFactor:1}],['mobile',{width:390,height:844,deviceScaleFactor:2,isMobile:true,hasTouch:true}]]){const p=await b.newPage();await p.emulate({viewport:vp});await p.goto(url,{waitUntil:'networkidle0'});await new Promise(r=>setTimeout(r,800));
await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=400){scrollTo(0,y);await new Promise(r=>setTimeout(r,60))}scrollTo(0,0)});await new Promise(r=>setTimeout(r,400));
await p.screenshot({path:S+out+'-'+n+'.png',fullPage:true});await p.close()}await b.close()})();
