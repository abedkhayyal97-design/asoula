// jar-shots.js <baseUrl> -> screenshots/jars-*.png
const P=require('/tmp/pp/node_modules/puppeteer-core');const U=process.argv[2].replace(/\/?$/,'/');const S='/workspace/asoula/screenshots/';const w=ms=>new Promise(r=>setTimeout(r,ms));
const slugs=['ashwak-jardiyya','kina','murrar','habbet-el-baraka'];
(async()=>{const b=await P.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const out={};
for(const dpr of [1,3]){
 // 1) product pages: jar frame of each
 for(const sl of slugs){const p=await b.newPage();await p.setViewport({width:1000,height:900,deviceScaleFactor:dpr});await p.goto(U+'honey/'+sl+'/',{waitUntil:'networkidle0'});await w(500);
  await p.addStyleTag({content:'*{animation:none!important}#bee{display:none}'});await w(200);
  const el=await p.$('.pgm');await el.screenshot({path:`/tmp/jar-${sl}-${dpr}.png`});
  const m=await p.evaluate(()=>{const j=document.querySelector('.pgm .jar');const cs=getComputedStyle(j).getPropertyValue('--c').trim();return cs});out[sl+dpr]=m;await p.close()}
 // 2) cards + hero + stage tabs on home
 const p=await b.newPage();await p.setViewport({width:1200,height:900,deviceScaleFactor:dpr});await p.goto(U,{waitUntil:'networkidle0'});await p.addStyleTag({content:'*{animation:none!important}#bee{display:none}'});await w(500);
 const cards=await p.$$('.pc .jar');for(let i=0;i<cards.length;i++){await cards[i].screenshot({path:`/tmp/card-${i}-${dpr}.png`})}
 out['cardColors'+dpr]=await p.$$eval('.pc .jar',js=>js.map(j=>getComputedStyle(j).getPropertyValue('--c').trim()));
 await (await p.$('.hero .jar')).screenshot({path:`/tmp/hero-${dpr}.png`});
 const tabs=await p.$$('#tabs button');out['stage'+dpr]=[];
 for(let i=0;i<tabs.length;i++){await tabs[i].click();await w(700);await p.addStyleTag({content:'*{animation:none!important}'});out['stage'+dpr].push(await p.$eval('#pjar',j=>getComputedStyle(j).getPropertyValue('--c').trim()));await (await p.$('#pjar')).screenshot({path:`/tmp/stage-${i}-${dpr}.png`})}
 await p.close()}
console.log(JSON.stringify(out));await b.close()})();
