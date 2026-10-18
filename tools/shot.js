const P=require('/tmp/pp/node_modules/puppeteer-core');const [U,pre,mode]=[process.argv[2],process.argv[3],process.argv[4]||'full'];
const S='/workspace/asoula/screenshots/';
(async()=>{const b=await P.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
for(const [n,vp] of [['desktop',{width:1366,height:850}],['mobile',{width:390,height:844,deviceScaleFactor:2,isMobile:true,hasTouch:true}]]){const p=await b.newPage();await p.emulate({viewport:vp});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>m.type()=='error'&&errs.push(m.text()));p.on('requestfailed',r=>errs.push('REQFAIL '+r.url()));
await p.goto(U,{waitUntil:'load'});await new Promise(r=>setTimeout(r,1800));
await p.screenshot({path:S+pre+n+'-top.png'});
await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=500){scrollTo(0,y);await new Promise(r=>setTimeout(r,120))}scrollTo(0,0)});await new Promise(r=>setTimeout(r,600));
await p.screenshot({path:S+pre+n+'-full.png',fullPage:true});console.log(n,'errors',JSON.stringify(errs),'overflowX',await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth));await p.close()}
await b.close()})();
