const P=require('/tmp/pp/node_modules/puppeteer-core');const w=ms=>new Promise(r=>setTimeout(r,ms));
const U={orig:'https://aasolabrand1.netlify.app/',new:process.argv[2]||'http://localhost:8800/'};
(async()=>{const b=await P.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const R={};
for(const k of ['orig','new']){const p=await b.newPage();await p.setViewport({width:1366,height:850});
 if(k=='orig'){await p.setRequestInterception(true);p.on('request',r=>/netlify\/scripts/.test(r.url())?r.abort():r.continue())}
 await p.goto(U[k],{waitUntil:'networkidle0'});await w(1000);
 const r={};
 r.tabs=await p.evaluate(()=>document.querySelectorAll('#tabs button').length);
 r.stage=[];
 for(let i=0;i<4;i++){await p.evaluate(i=>document.querySelectorAll('#tabs button')[i].click(),i);await w(500);
  r.stage.push(await p.evaluate(()=>{const s=document.getElementById('stage');const c=s.cloneNode(true);c.querySelectorAll('[aria-controls],[role],[id]').forEach(e=>{});
   return {txt:s.innerText.replace(/\s+/g,' ').trim(),wa:[...document.querySelectorAll('a[href*="wa.me"]')].map(a=>a.href),sel:[...document.querySelectorAll('#tabs button')].map(x=>x.className+'|'+x.getAttribute('aria-selected'))}}))}
 // animation: bee position moves?
 r.bee=[];for(let i=0;i<3;i++){r.bee.push(await p.evaluate(()=>{const e=document.getElementById('bee');return e?getComputedStyle(e).transform:null}));await w(900)}
 r.marquee=await p.evaluate(()=>[...document.querySelectorAll('*')].filter(e=>getComputedStyle(e).animationName!='none').map(e=>e.className+':'+getComputedStyle(e).animationName).slice(0,8));
 // dialog
 await p.evaluate(()=>document.getElementById('cb').click());await w(300);r.dlgOpen=await p.evaluate(()=>document.getElementById('cr').open);
 await p.keyboard.press('Escape');await w(200);r.dlgClosedEsc=await p.evaluate(()=>!document.getElementById('cr').open);
 // hover
 await p.hover('#ord');await w(400);r.hover=await p.evaluate(()=>{const e=document.getElementById('ord');const s=getComputedStyle(e);return s.transform+'|'+s.backgroundColor+'|'+s.boxShadow});
 R[k]=r;await p.close()}
await b.close();
const o=JSON.stringify(R.orig.stage.map(s=>[s.txt,s.sel])),n=JSON.stringify(R.new.stage.map(s=>[s.txt,s.sel]));
console.log('tabs',R.orig.tabs,R.new.tabs,'| stage text+selection equal:',o==n);
const norm=u=>u.replace(/https?:\/\/[^/]*\/?/,'');
console.log('wa links orig',JSON.stringify(R.orig.stage.map(s=>s.wa.map(x=>decodeURIComponent(x).slice(0,70)))));
console.log('wa links new ',JSON.stringify(R.new.stage.map(s=>s.wa.map(x=>decodeURIComponent(x).slice(0,70)))));
console.log('wa equal:',JSON.stringify(R.orig.stage.map(s=>s.wa))==JSON.stringify(R.new.stage.map(s=>s.wa)));
console.log('bee orig',R.orig.bee,'\nbee new',R.new.bee);console.log('anim orig',R.orig.marquee,'\nanim new',R.new.marquee);
console.log('dlg',R.orig.dlgOpen,R.new.dlgOpen,R.orig.dlgClosedEsc,R.new.dlgClosedEsc);console.log('hover',R.orig.hover,'\n',R.new.hover);})();
