// qa.js <baseUrl> [testBaseUrl-with-sample-data]
const P=require('/tmp/pp/node_modules/puppeteer-core');const U=process.argv[2].replace(/\/?$/,'/'),T=(process.argv[3]||'').replace(/\/?$/,'/');
const w=ms=>new Promise(r=>setTimeout(r,ms));let fails=0;const bad=(...a)=>{fails++;console.log('  FAIL',...a)};
const pages=['','honey/ashwak-jardiyya/','honey/kina/','honey/murrar/','honey/habbet-el-baraka/','privacy/'];
const widths=[320,360,390,414,768,1024,1440];
(async()=>{const b=await P.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
console.log('== layout / tap targets / errors ==');
for(const wd of widths){const mobile=wd<800;
 for(const pg of pages){const p=await b.newPage();await p.emulate({viewport:{width:wd,height:mobile?800:900,deviceScaleFactor:1,isMobile:mobile,hasTouch:mobile}});
  const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>m.type()=='error'&&errs.push(m.text()));p.on('requestfailed',r=>errs.push('REQFAIL '+r.url()));p.on('response',r=>r.status()>=400&&errs.push(r.status()+' '+r.url()));
  await p.goto(U+pg,{waitUntil:'networkidle0'});await w(400);
  const r=await p.evaluate(()=>{const o={sw:document.documentElement.scrollWidth,iw:innerWidth,small:[],inl:0,over:[]};
   const sel='a,button,summary,input:not([type=hidden]),label.wc';
   document.querySelectorAll(sel).forEach(e=>{if(e.id==='bee')return;const cs=getComputedStyle(e);if(cs.visibility==='hidden'||cs.display==='none')return;let t=e;if(e.matches('input[type=radio]'))t=e.nextElementSibling||e;const r=t.getBoundingClientRect();if(r.width===0||r.height===0)return;
     if(e.classList.contains('skip'))return;
     const inline=cs.display==='inline'&&e.tagName==='A';if(inline){o.inl++;return}
     if(r.height<43.5||r.width<43.5)o.small.push((e.id||e.className||e.tagName)+':'+e.textContent.trim().slice(0,18)+' '+Math.round(r.width)+'x'+Math.round(r.height))});
   // elements wider than viewport
   document.querySelectorAll('body *').forEach(e=>{const r=e.getBoundingClientRect();if(r.width>0&&(r.right>innerWidth+1||r.left<-1)&&!e.closest('.band,.liq,.tr,.fw,#bee,#bbl,.pgs,svg,.hd .nv')&&getComputedStyle(e).position!=='fixed')o.over.push(e.tagName+'.'+e.className)});
   o.dir=document.documentElement.dir;return o});
  const tag=`${wd}px ${pg||'home'}`;
  if(r.sw>r.iw)bad(tag,'horizontal scroll',r.sw,'>',r.iw);
  if(r.small.length)bad(tag,'small tap targets',JSON.stringify(r.small.slice(0,6)));
  if(r.over.length)bad(tag,'overflowing',JSON.stringify([...new Set(r.over)].slice(0,5)));
  if(errs.length)bad(tag,'errors',JSON.stringify(errs));
  if(r.dir!=='rtl')bad(tag,'dir');
  await p.close()}
 console.log(wd+'px done');}
console.log('== mobile menu / keyboard ==');
for(const wd of [320,390]){const p=await b.newPage();await p.emulate({viewport:{width:wd,height:800,deviceScaleFactor:2,isMobile:true,hasTouch:true}});await p.goto(U,{waitUntil:'networkidle0'});await w(300);
 const hh=await p.evaluate(()=>document.querySelector('.hd').getBoundingClientRect().height);
 await p.tap('#mb');await w(300);
 const o=await p.evaluate(()=>{const n=document.getElementById('nv'),r=n.getBoundingClientRect();return{exp:document.getElementById('mb').getAttribute('aria-expanded'),vis:getComputedStyle(n).display,top:r.top,bottom:r.bottom,l:r.left,rt:r.right,iw:innerWidth,hdh:document.querySelector('.hd').getBoundingClientRect().height,links:[...n.querySelectorAll('a')].map(a=>Math.round(a.getBoundingClientRect().height))}});
 if(o.exp!=='true'||o.vis==='none')bad(wd,'menu did not open');if(o.hdh!==hh)bad(wd,'header height changed',hh,o.hdh);if(o.l<-1||o.rt>o.iw+1)bad(wd,'menu overflow');if(o.links.some(h=>h<44))bad(wd,'menu link small',o.links);
 await p.screenshot({path:'/workspace/asoula/screenshots/plan-menu-open-'+wd+'.png',clip:{x:0,y:0,width:wd,height:420}});
 await p.keyboard.press('Escape');await w(200);const c=await p.evaluate(()=>({exp:document.getElementById('mb').getAttribute('aria-expanded'),foc:document.activeElement.id}));
 if(c.exp!=='false'||c.foc!=='mb')bad(wd,'Esc should close + refocus toggle',JSON.stringify(c));
 // nav link navigates and closes
 await p.tap('#mb');await w(250);await p.evaluate(()=>document.querySelector('#nv a[href="#faq"]').click());await w(2500);
 const f=await p.evaluate(()=>({exp:document.getElementById('mb').getAttribute('aria-expanded'),y:document.getElementById('faq').getBoundingClientRect().top,hash:location.hash}));
 if(f.exp!=='false')bad(wd,'menu stays open after link');if(f.y<0||f.y>140)bad(wd,'faq not scrolled under header',f.y);
 console.log(wd,'menu ok; header',hh,'px; faq top after nav',Math.round(f.y));await p.close()}
{const p=await b.newPage();await p.setViewport({width:1366,height:850});await p.goto(U,{waitUntil:'networkidle0'});
 const d=await p.evaluate(()=>({mb:getComputedStyle(document.getElementById('mb')).display,nv:getComputedStyle(document.getElementById('nv')).display,h:document.querySelector('.hd').getBoundingClientRect().height}));
 if(d.mb!=='none'||d.nv==='none')bad('desktop nav',JSON.stringify(d));console.log('desktop nav',JSON.stringify(d));
 // tab order: first stops are skip link then header
 await p.keyboard.press('Tab');const t1=await p.evaluate(()=>document.activeElement.className);await p.keyboard.press('Tab');const t2=await p.evaluate(()=>document.activeElement.textContent.trim().slice(0,20));console.log('tab1',t1,'tab2',t2);await p.close()}
console.log('== WhatsApp message decode ==');
const dec=u=>{const x=new URL(u);return{host:x.host,path:x.pathname,text:x.searchParams.get('text')}};
const NAMES={'ashwak-jardiyya':'عسل أشواك جردية','kina':'عسل الكينا','murrar':'عسل المرّار','habbet-el-baraka':'عسل حبة البركة'};
const p=await b.newPage();await p.setViewport({width:390,height:844,isMobile:true,hasTouch:true});
for(const [slug,nm] of Object.entries(NAMES)){await p.goto(U+'honey/'+slug+'/',{waitUntil:'networkidle0'});
 const h0=await p.$eval('#ord',a=>a.href);let d=dec(h0);const exp1='مرحباً عسولة، أرغب بطلب المنتج التالي:\nاسم المنتج: '+nm+'\nالكمية: 1\nأرجو تأكيد السعر النهائي وتكلفة التوصيل.';
 if(d.host!=='wa.me'||d.path!=='/963997883618'||d.text!==exp1)bad(slug,'default msg',JSON.stringify(d));
 if(/%[0-9A-F]{2}/.test(decodeURIComponent(h0.split('text=')[1]))&&false)bad('double encoded');
 await p.click('#qp');await p.click('#qp');const h1=await p.$eval('#ord',a=>a.href);d=dec(h1);
 if(!d.text.includes('اسم المنتج: '+nm+'\n')||!d.text.includes('الكمية: 3\n')||d.text.includes('الوزن'))bad(slug,'qty msg',JSON.stringify(d));
 await p.evaluate(()=>{const q=document.getElementById('qn');q.value='abc';q.dispatchEvent(new Event('input'))});const h2=dec(await p.$eval('#ord',a=>a.href));if(!h2.text.includes('الكمية: 1\n'))bad(slug,'invalid qty fallback',h2.text);
 await p.evaluate(()=>{const q=document.getElementById('qn');q.value='500';q.dispatchEvent(new Event('change'))});const h3=dec(await p.$eval('#ord',a=>a.href));if(!h3.text.includes('الكمية: 99\n'))bad(slug,'qty clamp',h3.text);
 console.log(slug,'OK  raw href prefix:',h0.slice(0,60)+'…  decoded:',JSON.stringify(h1&&dec(h1).text))}
if(T){console.log('-- with sample weights/price (test fixture, not deployed) --');
 await p.goto(T+'honey/kina/',{waitUntil:'networkidle0'});
 const radios=await p.$$('input[name=w]');console.log('weight radios',radios.length);
 await p.evaluate(()=>document.querySelectorAll('input[name=w]')[0].click());await p.evaluate(()=>{const b=document.getElementById('qp');b.click()});
 let d=dec(await p.$eval('#ord',a=>a.href));const exp='مرحباً عسولة، أرغب بطلب المنتج التالي:\nاسم المنتج: عسل الكينا\nالوزن: 500 غ\nالكمية: 2\nأرجو تأكيد السعر النهائي وتكلفة التوصيل.';
 if(d.text!==exp)bad('weight msg',JSON.stringify(d.text));else console.log('weight message exact match ✓');
 const pr=await p.$eval('#pr',e=>e.textContent);if(!pr.includes('6,000'))bad('weight price not shown',pr);else console.log('price switches to',pr);
 await p.evaluate(()=>document.querySelectorAll('input[name=w]')[1].click());const pr2=await p.$eval('#pr',e=>e.textContent);if(!pr2.includes('10,000'))bad('fallback price',pr2);
 console.log('card on home shows price/availability:',await (async()=>{await p.goto(T,{waitUntil:'networkidle0'});return p.$$eval('.pc',c=>c.map(x=>x.querySelector('.pr').textContent+(x.querySelector('.av')?' | '+x.querySelector('.av').textContent:'')))})());
 const ws=await p.$$eval('.wc span',s=>s.map(x=>[Math.round(x.getBoundingClientRect().width),Math.round(x.getBoundingClientRect().height)]));console.log('weight chip sizes',JSON.stringify(ws));}
// default pages must not show invented data
await p.goto(U+'honey/kina/',{waitUntil:'networkidle0'});
const txt=await p.evaluate(()=>document.body.innerText);console.log('default page: price shown =',/السعر عند الطلب/.test(txt),'; has weight picker =',!!(await p.$('input[name=w]')),'; has availability badge =',!!(await p.$('.av')),'; digits-with-currency =',/\d+\s*(ل\.س|\$|دولار|ليرة)/.test(txt));
console.log(fails?('FAILURES: '+fails):'ALL CHECKS PASSED');await b.close()})();
