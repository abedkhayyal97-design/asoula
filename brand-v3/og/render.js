const P=require('/tmp/pp/node_modules/puppeteer-core');
(async()=>{const b=await P.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--allow-file-access-from-files']});
const p=await b.newPage();await p.setViewport({width:1200,height:630,deviceScaleFactor:2});
await p.goto('file:///workspace/asoula/brand-v3/og/og.html',{waitUntil:'networkidle0'});await p.evaluate(()=>document.fonts.ready);await new Promise(r=>setTimeout(r,500));
console.log(await p.evaluate(()=>{const t=document.getElementById('t').getBoundingClientRect(),l=document.getElementById('lg').getBoundingClientRect();return JSON.stringify({font:getComputedStyle(document.getElementById('t')).fontFamily,tw:t.width,th:t.height,lg:[l.top,l.bottom],fontOK:document.fonts.check('700 52px CairoB')})}));
await p.screenshot({path:'/workspace/asoula/brand-v3/og/og@2x.png'});await b.close()})();
