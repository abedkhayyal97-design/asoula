const bee=$("bee"),bub=$("bbl"),BW=48,FX=21,FY=40,FL=[...document.querySelectorAll(".fw")],rm=matchMedia("(prefers-reduced-motion:reduce)");
const FLY=["أوه! لقد أمسكتني، إذاً عليك أن تشتري العسل وإلا فإنني سألسعك!","أمسكتَني؟! حسناً، سأسامحك إن طلبتَ برطمان عسل الآن.","اتركني أطير! وخذ معك برطمان عسل وسأنسى الأمر.","بززز! اشترِ عسلاً من عسولة وإلا لسعتُك لسعةً صغيرة!","يا لك من صيّاد ماهر! اطلب العسل وأعدك أن أكفّ عن اللسع."];
const REST=["دعني أعمل! طلبات الزبائن لا تنتهي","شش… أنا في وقت العمل، فالرحيق لن يجمع نفسه!","ألا ترى أنني مشغولة؟ هذه الزهرة لن تُجمع وحدها!","اتركني أكمل جولتي، فالعسل ينتظرك في الجرّة!"];
let x=-60,y=120,tx=innerWidth*.6,ty=140,f=1,t=0,w=0,hd=0,mode="fly",amp=1,pe=0,cur=null,last=0,cu=0,dn=0,px=0,py=0,rl=0,raf=0,hide=0,clr=0,onF=0,qa=Math.random()*9|0,qb=Math.random()*9|0,nx=performance.now()+6e3+Math.random()*6e3;
const hp=e=>{const r=e.getBoundingClientRect(),a=e.dataset.h.split(",");return[r.left+r.width*a[0],r.top+r.height*a[1]]};
const ok=p=>p[0]>24&&p[0]<innerWidth-24&&p[1]>84&&p[1]<innerHeight-24;
const vis=()=>FL.filter(e=>ok(hp(e)));
function pickRand(){tx=30+Math.random()*(innerWidth-100);ty=80+Math.random()*(innerHeight-180)}
function pick(){if(performance.now()>nx){const v=vis().filter(e=>e!==cur);if(v.length){cur=v[Math.random()*v.length|0];mode="land";nx=1/0;return}}pickRand()}
function place(){if(!bub.classList.contains("on"))return;const bw=bub.offsetWidth,bh=bub.offsetHeight,cx=x+BW/2;let bx=Math.max(8,Math.min(innerWidth-bw-8,cx-bw/2)),by=y-bh-14,bl=0;if(by<72){by=y+BW+14;bl=1}by=Math.max(8,Math.min(innerHeight-bh-8,by));bub.style.transform="translate("+bx+"px,"+by+"px)";bub.style.setProperty("--tx",Math.max(18,Math.min(bw-18,cx-bx))+"px");bub.classList.toggle("bl",bl)}
function say(txt,cta){clearTimeout(clr);bub.textContent="";const s=document.createElement("span");s.textContent=txt;bub.append(s);if(cta){const a=document.createElement("a");a.className="bc";a.href=mk("طلب عسل");a.target="_blank";a.rel="noopener";a.textContent="اطلب عسلك الآن ↗";bub.append(a)}bub.classList.add("on");place()}
function unsay(){rl=0;bub.classList.remove("on");clr=setTimeout(()=>{if(!bub.classList.contains("on"))bub.textContent=""},400)}
function catchBee(){if(mode==="caught")return;const was=mode==="perch"||(rm.matches&&onF),line=was?REST[qb++%REST.length]:FLY[qa++%FLY.length];bee.classList.remove("pr");
 if(rm.matches){say(line,!was);clearTimeout(hide);hide=setTimeout(unsay,5e3);return}
 mode="caught";bee.classList.add("ct");cu=performance.now()+2400;rl=1/0;say(line,!was)}
function release(now){mode="fly";bee.classList.remove("ct");rl=now+2200;nx=now+1e4+Math.random()*1e4;w=0;hd=0;pickRand()}
function takeoff(now){mode="fly";bee.classList.remove("pr");nx=now+14e3+Math.random()*14e3;w=10;y-=3;pickRand()}
function toJar(){if(mode==="caught")return;if(mode!=="fly")takeoff(performance.now());const r=$("pjar").getBoundingClientRect();tx=Math.min(innerWidth-70,Math.max(10,r.left+r.width/2-24));ty=Math.min(innerHeight-90,Math.max(70,r.top+r.height/2-40));hd=70}
bee.addEventListener("pointerdown",e=>{e.preventDefault();try{bee.setPointerCapture(e.pointerId)}catch(_){}dn=1;px=e.clientX;py=e.clientY;catchBee()});
bee.addEventListener("pointermove",e=>{if(dn){px=e.clientX;py=e.clientY}});
const up=()=>{if(dn){dn=0;if(mode==="caught")cu=Math.max(cu,performance.now()+700)}};
bee.addEventListener("pointerup",up);bee.addEventListener("pointercancel",up);
bee.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();catchBee()}});
addEventListener("keydown",e=>{if(e.key==="Escape")unsay()});
function draw(wob){bee.style.transform="translate("+x+"px,"+(y+wob)+"px) scaleX("+f+") rotate("+(mode==="caught"?Math.sin(t*14)*9:wob)+"deg)"}
function tick(ts){raf=requestAnimationFrame(tick);const now=performance.now(),k=Math.min(3,(ts-last)/16.667||1);last=ts;t+=.08*k;
 if(mode==="caught"){if(dn){x=px-BW/2;y=py-BW/2}else if(now>=cu)release(now)}
 else if(mode==="perch"){const p=hp(cur);if(!ok(p)||now>pe)takeoff(now);else{x=p[0]-(f>0?FX:BW-FX);y=p[1]-FY+2}}
 else{if(mode==="land"){const p=hp(cur);if(!ok(p)){mode="fly";nx=now+5e3;pickRand()}else{tx=p[0]-(f>0?FX:BW-FX);ty=p[1]-FY+2}}
  const dx=tx-x,dy=ty-y,d=Math.hypot(dx,dy);
  if(mode==="land"&&d<2){mode="perch";x=tx;y=ty;bee.classList.add("pr");pe=now+3e3+Math.random()*3500}
  else if(mode==="fly"&&d<14){if(hd>0)hd-=k;else if((w-=k)<=0){pick();w=20+Math.random()*60}}
  else{const s=Math.min(Math.min(3.2,d*.05+.6)*k,d);x+=dx/d*s;y+=dy/d*s;if(Math.abs(dx)>6)f=dx>0?1:-1}}
 amp+=((mode==="fly"||mode==="land")-amp)*Math.min(1,.12*k);
 draw(Math.sin(t*2.5)*6*amp);
 if(mode==="caught"||mode==="perch")place();
 if(rl&&now>rl&&!bub.matches(":hover,:focus-within"))unsay()}
function rest(){const v=vis();let b=null,bd=1e9;for(const e of v){const p=hp(e),d=Math.abs(p[1]-innerHeight*.55)+(e===cur?-80:0);if(d<bd){bd=d;b=e}}
 if(b){cur=b;const p=hp(b);x=p[0]-FX;y=p[1]-FY+2;f=1;onF=1;bee.classList.add("pr")}else{x=innerWidth-80;y=90;onF=0;bee.classList.remove("pr")}
 draw(0);place()}
if(rm.matches){let q=0;const u=()=>{q||(q=requestAnimationFrame(()=>{q=0;rest()}))};u();addEventListener("scroll",u,{passive:true});addEventListener("resize",u);addEventListener("load",u)}
else{raf=requestAnimationFrame(tick);document.addEventListener("visibilitychange",()=>{cancelAnimationFrame(raf);if(!document.hidden){last=0;raf=requestAnimationFrame(tick)}})}
