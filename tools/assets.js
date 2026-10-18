// Renders favicon.svg, favicon.ico (multi-size PNG), app icons (192/512/1024/maskable/apple) and og.jpg (1200x630, 2x supersampled)
// from the site's own vector art (src/art.mjs). Usage: node tools/assets.js   (needs /tmp/pp puppeteer-core + python3 PIL)
const P=require('/tmp/pp/node_modules/puppeteer-core'),fs=require('fs'),cp=require('child_process');
(async()=>{
const {ALL_DEFS,beeArt,JAR_STANDALONE}=await import('/workspace/asoula/src/art.mjs');
const OUT='/workspace/asoula/docs/',AIN=fs.readFileSync('/workspace/asoula/src/ain.path','utf8');
const fonts=fs.readFileSync('/workspace/asoula/fonts.css','utf8').replace(/url\(fonts\//g,'url(file://'+OUT+'fonts/');
const glyph=(cx,cy,h,fill)=>{const s=h/1445;return `<path d="${AIN}" fill="${fill}" transform="translate(${cx} ${cy}) scale(${s} ${-s}) translate(-548 -22.5)"/>`};
const disc=(cx,cy,r,fill="url(#gg)")=>`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/><circle cx="${cx}" cy="${cy}" r="${r*.98}" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="${r*.02}"/><ellipse cx="${cx-r*.28}" cy="${cy-r*.5}" rx="${r*.52}" ry="${r*.3}" transform="rotate(-28 ${cx-r*.28} ${cy-r*.5})" fill="#fff" fill-opacity=".2"/>`;
const GG='<linearGradient id="gg" x2="1" y2="1"><stop stop-color="#F3E3B0"/><stop offset="1" stop-color="#CDA85A"/></linearGradient>';
const dataUrl=f=>'data:image/svg+xml;base64,'+fs.readFileSync(f).toString('base64');
const LOGO=dataUrl(OUT+'logo-dark.svg');
// favicon.svg: the bee from the brand logo (vector, traced) on the site's dark green; legible at 16px
const beeSvg=fs.readFileSync('/workspace/asoula/src/logo-bee-dark.svg','utf8');
const bee=beeSvg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number),beeBody=beeSvg.replace(/^[\s\S]*?<\/title>/,'').replace('</svg>','');
const k=44/Math.max(bee[2],bee[3]);
const fav=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#1B241A"/><g transform="translate(${n2(32-bee[2]*k/2)} ${n2(33-bee[3]*k/2)}) scale(${k.toFixed(4)}) translate(${-bee[0]} ${-bee[1]})">${beeBody}</g></svg>`;
function n2(v){return v.toFixed(2)}
fs.writeFileSync(OUT+'favicon.svg',fav);
const icon=(k)=>`<div style="width:100%;height:100%;background:radial-gradient(90% 80% at 50% 38%,#33452E,#151D14);display:grid;place-items:center"><img src="${LOGO}" style="width:${k*78}%;display:block;filter:drop-shadow(0 4% 6% #0008)"></div>`;
const page=(w,h,body)=>`<html lang=ar dir=rtl><meta charset=utf-8><style>${fonts}*{margin:0;box-sizing:border-box}html,body{width:${w}px;height:${h}px;overflow:hidden;background:transparent;font-family:'IBM Plex Sans Arabic'}</style><body>${body}</body></html>`;
const og=`<div style="width:1200px;height:630px;background:radial-gradient(110% 100% at 80% 0%,#3A4D33,#1B241A 65%);color:#F7F2E8;display:flex;align-items:center;justify-content:space-between;padding:0 90px;position:relative">
<div style="flex:1;display:flex;flex-direction:column;align-items:flex-start"><div style="color:#E6CF93;font-size:30px;font-weight:600;align-self:flex-start">من خيرات الطبيعة</div><img src="${LOGO}" style="width:520px;margin:18px 0 22px"><div style="font:700 56px/1.3 'Markazi Text';color:#F7F2E8">عسل جبلي بكافة أنواعه</div><div style="margin-top:14px;font-size:28px;color:#D3CFBC">أشواك جردية · كينا · مرّار · حبة البركة</div></div>
<div style="width:330px;height:430px;filter:drop-shadow(0 20px 34px #E0A93B66)">${JAR_STANDALONE("#E0A93B")}</div></div>`;
const b=await P.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
async function shot(html,w,h,file,o={}){const p=await b.newPage();await p.setViewport({width:w,height:h,deviceScaleFactor:o.dpr||1});await p.setContent(html,{waitUntil:'networkidle0'});await p.evaluate(()=>document.fonts.ready);await new Promise(r=>setTimeout(r,300));await p.screenshot({path:file,type:'png',omitBackground:true});await p.close()}
for(const [s,f,k] of [[1024,'icon-1024.png',1.12],[512,'icon-512.png',1.12],[192,'icon-192.png',1.12],[180,'apple-touch-icon.png',1.12],[512,'icon-maskable-512.png',.92]])await shot(page(s,s,icon(k)),s,s,OUT+f);
for(const s of [16,32,48,64,128,256])await shot(page(s,s,fav.replace('<svg ','<svg width="100%" height="100%" ')),s,s,`/tmp/fav-${s}.png`);
await shot(page(1200,630,`<svg width="0" height="0" style="position:absolute"><defs>${ALL_DEFS()}</defs></svg>`+og),1200,630,'/tmp/og2x.png',{dpr:2});
await b.close();
cp.execSync(`python3 - <<'PY'
import struct,io
from PIL import Image
sizes=[16,32,48,64,128,256];ims=[open(f'/tmp/fav-{s}.png','rb').read() for s in sizes]
hdr=struct.pack('<HHH',0,1,len(sizes));off=6+16*len(sizes);ent=b'';
for s,d in zip(sizes,ims):
    ent+=struct.pack('<BBBBHHII',s%256,s%256,0,0,1,32,len(d),off);off+=len(d)
open('${OUT}favicon.ico','wb').write(hdr+ent+b''.join(ims))
Image.open('/tmp/fav-32.png').save('${OUT}favicon-32.png');Image.open('/tmp/fav-64.png').save('${OUT}favicon-64.png')
im=Image.open('/tmp/og2x.png').convert('RGB').resize((1200,630),Image.LANCZOS);im.save('${OUT}og.jpg',quality=93,subsampling=0,optimize=True)
PY`);
console.log('assets done')})();
