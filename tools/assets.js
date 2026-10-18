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
// favicon.svg (no bee; legible at 16px)
const fav=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs>${GG}</defs><rect width="64" height="64" rx="14" fill="#1B241A"/>${disc(32,32,27)}${glyph(32.5,33.5,31,"#1B241A")}</svg>`;
fs.writeFileSync(OUT+'favicon.svg',fav);
const icon=(k,bee=true)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%"><defs>${GG}<radialGradient id="ibg" cx=".5" cy=".4" r=".8"><stop stop-color="#2E4029"/><stop offset="1" stop-color="#151D14"/></radialGradient></defs><rect width="512" height="512" fill="url(#ibg)"/><g transform="translate(256 256) scale(${k}) translate(-256 -256)"><ellipse cx="240" cy="470" rx="150" ry="14" fill="#000" fill-opacity=".28"/>${disc(240,282,172)}${glyph(242,286,232,"#1B241A")}${bee?`<g transform="translate(372 150) rotate(18) scale(1.95) translate(-26 -31)">${beeArt(false)}</g>`:""}</g></svg>`;
const page=(w,h,body,defs=true)=>`<html lang=ar dir=rtl><meta charset=utf-8><style>${fonts}*{margin:0;box-sizing:border-box}html,body{width:${w}px;height:${h}px;overflow:hidden;background:transparent;font-family:'IBM Plex Sans Arabic'}</style><body>${defs?`<svg width="0" height="0" style="position:absolute"><defs>${ALL_DEFS()}</defs></svg>`:""}${body}</body></html>`;
const og=`<div style="width:1200px;height:630px;background:radial-gradient(110% 100% at 80% 0%,#3A4D33,#1B241A 65%);color:#F7F2E8;display:flex;align-items:center;justify-content:space-between;padding:0 90px;position:relative">
<div style="flex:1"><div style="color:#E6CF93;font-size:30px;font-weight:600">من خيرات الطبيعة</div><div style="font:700 150px/1.1 'Markazi Text';background:linear-gradient(120deg,#F3E3B0,#CDA85A,#F3E3B0);-webkit-background-clip:text;color:transparent;margin:6px 0">عسولة</div><div style="font:700 56px/1.3 'Markazi Text';color:#F7F2E8">عسل جبلي بكافة أنواعه</div><div style="margin-top:18px;font-size:28px;color:#D3CFBC">أشواك جردية · كينا · مرّار · حبة البركة</div></div>
<div style="width:330px;height:430px;filter:drop-shadow(0 20px 34px #E0A93B66)">${JAR_STANDALONE("#E0A93B")}</div>
<div style="position:absolute;left:72px;top:60px;width:84px;height:84px;transform:rotate(-8deg)"><svg viewBox="0 0 56 56" style="width:100%;height:100%;overflow:visible">${beeArt(false)}</svg></div></div>`;
const b=await P.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
async function shot(html,w,h,file,o={}){const p=await b.newPage();await p.setViewport({width:w,height:h,deviceScaleFactor:o.dpr||1});await p.setContent(html,{waitUntil:'networkidle0'});await p.evaluate(()=>document.fonts.ready);await new Promise(r=>setTimeout(r,300));await p.screenshot({path:file,type:'png',omitBackground:true});await p.close()}
for(const [s,f,k] of [[1024,'icon-1024.png',1],[512,'icon-512.png',1],[192,'icon-192.png',1],[180,'apple-touch-icon.png',1],[512,'icon-maskable-512.png',.86]])await shot(page(s,s,icon(k),true),s,s,OUT+f);
for(const s of [16,32,48,64,128,256])await shot(page(s,s,fav.replace('<svg ','<svg width="100%" height="100%" '),false),s,s,`/tmp/fav-${s}.png`);
await shot(page(1200,630,og),1200,630,'/tmp/og2x.png',{dpr:2});
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
