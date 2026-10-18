// Vector artwork for Asoula (jar, bee, logo, flowers). Same composition/colours/viewBoxes as the original, with much more detail.
// All numbers are generated here with fixed precision (no rounding artefacts). Exported strings are injected by build.mjs.
const n=x=>(+x.toFixed(2)).toString();
const bz=(p,t)=>{const u=1-t;return [u*u*u*p[0][0]+3*u*u*t*p[1][0]+3*u*t*t*p[2][0]+t*t*t*p[3][0],u*u*u*p[0][1]+3*u*u*t*p[1][1]+3*u*t*t*p[2][1]+t*t*t*p[3][1]]};
const bzd=(p,t)=>{const u=1-t;return [3*u*u*(p[1][0]-p[0][0])+6*u*t*(p[2][0]-p[1][0])+3*t*t*(p[3][0]-p[2][0]),3*u*u*(p[1][1]-p[0][1])+6*u*t*(p[2][1]-p[1][1])+3*t*t*(p[3][1]-p[2][1])]};
// Catmull-Rom -> cubic bezier path through points (smooth, no faceting)
const crom=pts=>{let d="";for(let i=0;i<pts.length-1;i++){const p0=pts[Math.max(0,i-1)],p1=pts[i],p2=pts[i+1],p3=pts[Math.min(pts.length-1,i+2)];d+="C"+n(p1[0]+(p2[0]-p0[0])/6)+" "+n(p1[1]+(p2[1]-p0[1])/6)+" "+n(p2[0]-(p3[0]-p1[0])/6)+" "+n(p2[1]-(p3[1]-p1[1])/6)+" "+n(p2[0])+" "+n(p2[1])}return d};
// tapered stroke (filled outline) along a cubic: width profile w(t)
function taper(P,w,N=28){const L=[],R=[];for(let i=0;i<=N;i++){const t=i/N,[x,y]=bz(P,t),[dx,dy]=bzd(P,t),l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l,h=w(t)/2;L.push([x+nx*h,y+ny*h]);R.push([x-nx*h,y-ny*h])}
 R.reverse();return "M"+n(L[0][0])+" "+n(L[0][1])+crom(L)+"L"+n(R[0][0])+" "+n(R[0][1])+crom(R)+"Z"}
const sinw=(m,e=.55,b=.7)=>t=>b+(m-b)*Math.pow(Math.sin(Math.PI*t),e);

// ---------- JAR ----------
const SK="M64 26Q100 17 136 26C140 44 154 54 158 70Q155 82 144 79Q133 84 122 79Q111 84 100 79Q89 84 78 79Q67 84 56 79Q45 82 42 70C46 54 60 44 64 26Z";
const twY=x=>{const t=(x-52)/96;return 57+22*t*(1-t)};
let folds="";
for(const x1 of [56,78,100,122,144]){const x0=100+(x1-100)*.8,y0=twY(x0)+2.4,y1=78.6,cx=x0+(x1-x0)*.35,cy=(y0+y1)/2;
 folds+=`<path d="M${n(x0)} ${n(y0)}Q${n(cx)} ${n(cy)} ${n(x1)} ${n(y1)}" stroke="#4A3018" stroke-opacity=".2" stroke-width="2.2" stroke-linecap="round" fill="none"/><path d="M${n(x0+1.7)} ${n(y0)}Q${n(cx+1.7)} ${n(cy)} ${n(x1+1.7)} ${n(y1-.6)}" stroke="#F3E3B0" stroke-opacity=".2" stroke-width="1.2" stroke-linecap="round" fill="none"/>`}
for(const x1 of [67,89,111,133]){const x0=100+(x1-100)*.82,y0=twY(x0)+2.4,y1=81.5;folds+=`<path d="M${n(x0)} ${n(y0)}Q${n(x0+(x1-x0)*.4)} ${n((y0+y1)/2)} ${n(x1)} ${n(y1)}" stroke="#4A3018" stroke-opacity=".11" stroke-width="1.5" stroke-linecap="round" fill="none"/>`}
for(let k=-3;k<=3;k++){const xt=100+k*10.5,xb=100+k*14,yb=twY(xb)-2;folds+=`<path d="M${n(xt)} ${n(24.5+Math.abs(k)*1.6)}Q${n(xt+(xb-xt)*.3)} ${n(40)} ${n(xb)} ${n(yb)}" stroke="#4A3018" stroke-opacity=".13" stroke-width="1.5" stroke-linecap="round" fill="none"/>`}
// twine ticks (twisted rope look) along y=twY
let ticks="";{const pts=[];for(let t=0;t<=1.0001;t+=.002){const x=52+96*t;pts.push([x,twY(x)])}let acc=0,last=pts[0];for(const p of pts.slice(1)){acc+=Math.hypot(p[0]-last[0],p[1]-last[1]);last=p;if(acc>=2.5){acc=0;ticks+=`M${n(p[0]-.9)} ${n(p[1]+1.9)}L${n(p[0]+.9)} ${n(p[1]-1.9)}`}}}
const TW="M52 57Q100 68 148 57",BOW="M148 57q14-12 16 0q-2 10-16 0M148 57q5 12 1 22M148 57q9 9 13 18";
const fray=(x,y,dx,dy)=>{const l=Math.hypot(dx,dy),a=Math.atan2(dy,dx);let s="";for(const o of [-.42,-.14,.16,.44]){const aa=a+o;s+=`M${n(x)} ${n(y)}l${n(Math.cos(aa)*3.2)} ${n(Math.sin(aa)*3.2)}`}return s};
const FRAY=fray(149,79,-4,10)+fray(161,75,4,9);
const HL1=taper([[31,111],[20,134],[18,172],[22.5,215]],sinw(8,.5,1.4));
const HL2=taper([[172,120],[178,138],[180,158],[178,176]],sinw(4.6,.5,1));
const HL3=taper([[40,92],[31,99],[25,110],[21,124]],sinw(3.2,.5,.8));
const HL4=taper([[184.5,142],[186.4,158],[186.6,176],[185,194]],sinw(2.2,.5,.6));
export const DEFS=()=>`
<linearGradient id="sh" x2="1"><stop stop-opacity=".35"/><stop offset=".45" stop-opacity="0"/><stop offset="1" stop-opacity=".3"/></linearGradient>
<linearGradient id="gg" x2="1" y2="1"><stop stop-color="#F3E3B0"/><stop offset="1" stop-color="#CDA85A"/></linearGradient>
<pattern id="bl" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 1H4M0 3H4" stroke="#6B4A26" stroke-opacity=".38" stroke-width=".8"/><path d="M1 0V4M3 0V4" stroke="#fff" stroke-opacity=".22" stroke-width=".8"/><path d="M0 0H2V2H0ZM2 2H4V4H2Z" fill="#fff" fill-opacity=".035"/><path d="M2 0H4V2H2ZM0 2H2V4H0Z" fill="#3A2A14" fill-opacity=".07"/></pattern>
<path id="wp" d="M0 30C100 0 200 0 300 30C400 60 500 60 600 30C700 0 800 0 900 30C1000 60 1100 60 1200 30V90H0Z"/>
<path id="bp" d="M60 56H140C140 70 150 74 166 84C184 96 190 120 190 150V206C190 232 172 246 146 246H54C28 246 10 232 10 206V150C10 120 16 96 34 84C50 74 60 70 60 56Z"/>
<path id="sk" d="${SK}"/>
<clipPath id="jc"><use href="#bp"/></clipPath>
<clipPath id="kc"><use href="#sk"/></clipPath>
<clipPath id="lc"><rect x="48" y="150" width="104" height="62" rx="18"/></clipPath>
<linearGradient id="gb" x2="1"><stop stop-color="#fff" stop-opacity=".36"/><stop offset=".09" stop-color="#fff" stop-opacity=".2"/><stop offset=".5" stop-color="#fff" stop-opacity=".1"/><stop offset=".91" stop-color="#fff" stop-opacity=".2"/><stop offset="1" stop-color="#fff" stop-opacity=".34"/></linearGradient>
<radialGradient id="cs"><stop stop-color="#1B1208" stop-opacity=".42"/><stop offset=".6" stop-color="#1B1208" stop-opacity=".16"/><stop offset="1" stop-color="#1B1208" stop-opacity="0"/></radialGradient>
<linearGradient id="gw" x2="1"><stop stop-color="#fff" stop-opacity=".4"/><stop offset=".07" stop-color="#fff" stop-opacity=".2"/><stop offset=".2" stop-color="#fff" stop-opacity="0"/><stop offset=".8" stop-color="#fff" stop-opacity="0"/><stop offset=".93" stop-color="#fff" stop-opacity=".14"/><stop offset="1" stop-color="#fff" stop-opacity=".42"/></linearGradient>
<linearGradient id="gt" x2="0" y2="1"><stop stop-color="#fff" stop-opacity=".05"/><stop offset="1" stop-color="#fff" stop-opacity=".24"/></linearGradient>
<linearGradient id="hv" x2="0" y2="1"><stop stop-color="#FFE9B0" stop-opacity=".24"/><stop offset=".1" stop-color="#FFE9B0" stop-opacity=".08"/><stop offset=".32" stop-color="#fff" stop-opacity="0"/><stop offset=".6" stop-color="#7A4208" stop-opacity=".1"/><stop offset="1" stop-color="#6B3A06" stop-opacity=".34"/></linearGradient>
<linearGradient id="hs" x2="1"><stop stop-color="#FFE2A0" stop-opacity="0"/><stop offset=".26" stop-color="#FFE2A0" stop-opacity=".12"/><stop offset=".42" stop-color="#FFE2A0" stop-opacity="0"/><stop offset=".78" stop-color="#FFE2A0" stop-opacity=".05"/><stop offset="1" stop-color="#FFE2A0" stop-opacity="0"/></linearGradient>
<radialGradient id="hg" cx=".5" cy=".5" r=".5"><stop stop-color="#FFD98A" stop-opacity=".26"/><stop offset="1" stop-color="#FFD98A" stop-opacity="0"/></radialGradient>
<linearGradient id="hl" x2="0" y2="1"><stop stop-color="#fff" stop-opacity=".92"/><stop offset=".6" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity=".22"/></linearGradient>
<linearGradient id="dg" x2="1"><stop stop-color="#fff" stop-opacity=".5"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#2A1608" stop-opacity=".32"/></linearGradient>
<radialGradient id="bu" cx=".34" cy=".3" r=".75"><stop stop-color="#fff" stop-opacity=".95"/><stop offset=".3" stop-color="#fff" stop-opacity=".25"/><stop offset=".8" stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#fff" stop-opacity=".7"/></radialGradient>
<linearGradient id="pa" x2="0" y2="1"><stop stop-color="#FCF6E4"/><stop offset="1" stop-color="#F3E7C6"/></linearGradient>
<linearGradient id="pc" x2="1"><stop stop-color="#5A3C1E" stop-opacity=".16"/><stop offset=".14" stop-color="#5A3C1E" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".14"/><stop offset=".86" stop-color="#5A3C1E" stop-opacity="0"/><stop offset="1" stop-color="#5A3C1E" stop-opacity=".2"/></linearGradient>
<linearGradient id="lf" x2="0" y2="1"><stop stop-color="#DDBC82"/><stop offset=".45" stop-color="#C9A56A"/><stop offset="1" stop-color="#AE8650"/></linearGradient>
<linearGradient id="lv" x2="0" y2="1"><stop stop-color="#fff" stop-opacity=".1"/><stop offset=".28" stop-color="#fff" stop-opacity="0"/><stop offset=".62" stop-color="#2A1608" stop-opacity="0"/><stop offset="1" stop-color="#2A1608" stop-opacity=".3"/></linearGradient>
<radialGradient id="kn" cx=".4" cy=".35" r=".7"><stop stop-color="#A97B3F"/><stop offset="1" stop-color="#4A3018"/></radialGradient>
<linearGradient id="wgd" x2="1" y2="1"><stop stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#D8E8D6" stop-opacity=".6"/></linearGradient>
<radialGradient id="bbg" cx=".38" cy=".28" r=".85"><stop stop-color="#FBDC84"/><stop offset=".55" stop-color="#F2C14E"/><stop offset="1" stop-color="#D99A2B"/></radialGradient>
<radialGradient id="bhd" cx=".35" cy=".3" r=".85"><stop stop-color="#5A4224"/><stop offset="1" stop-color="#2A1D0D"/></radialGradient>
<g id="jb"><ellipse cx="100" cy="250" rx="78" ry="6.5" fill="url(#cs)"/><use href="#bp" fill="url(#gb)"/><use href="#bp" fill="none" stroke="#B98A43" stroke-opacity=".5" stroke-width="2"/></g>
<g id="jf">
<g clip-path="url(#jc)"><use href="#sk" fill="#1B1208" fill-opacity=".055" transform="translate(0 1)"/><use href="#sk" fill="#1B1208" fill-opacity=".055" transform="translate(0 2)"/><use href="#sk" fill="#1B1208" fill-opacity=".055" transform="translate(0 3)"/><use href="#sk" fill="#1B1208" fill-opacity=".055" transform="translate(0 4)"/><use href="#sk" fill="#1B1208" fill-opacity=".055" transform="translate(0 5)"/><use href="#sk" fill="#1B1208" fill-opacity=".055" transform="translate(0 6.2)"/><rect y="50" width="200" height="210" fill="url(#sh)"/><rect y="50" width="200" height="210" fill="url(#hs)"/><ellipse cx="100" cy="212" rx="86" ry="46" fill="url(#hg)"/></g>
<use href="#bp" fill="none" stroke="url(#gw)" stroke-width="9" clip-path="url(#jc)"/>
<path d="M10 206C10 232 28 246 54 246H146C172 246 190 232 190 206L185 206C185 229 169 241 146 241H54C31 241 15 229 15 206Z" fill="url(#gt)"/>
<path d="M15 206C15 229 31 241 54 241H146C169 241 185 229 185 206" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width=".7"/>
<path d="M13 224C16 236 30 244.4 52 244.4H98" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="1.1" stroke-linecap="round"/>
<path d="${HL1}" fill="url(#hl)"/><path d="${HL2}" fill="url(#hl)" fill-opacity=".62"/><path d="${HL3}" fill="url(#hl)" fill-opacity=".8"/><path d="${HL4}" fill="#fff" fill-opacity=".34"/>
<rect x="49" y="152.6" width="104" height="62" rx="18" fill="#3A2A14" fill-opacity=".1"/><rect x="48.4" y="151.4" width="104" height="62" rx="18" fill="#3A2A14" fill-opacity=".1"/>
<rect x="48" y="150" width="104" height="62" rx="18" fill="url(#pa)" stroke="#D9BE7C"/><rect x="48" y="150" width="104" height="62" rx="18" fill="url(#pc)"/>
<rect x="52" y="154" width="96" height="54" rx="14" fill="none" stroke="#D9BE7C" stroke-opacity=".8" stroke-width=".6"/>
<path d="M57 202.2H70M130 202.2H143" stroke="#C9A56A" stroke-width=".7" stroke-linecap="round"/><path d="M71.8 202.2l1.4-1.4 1.4 1.4-1.4 1.4zM125.4 202.2l1.4-1.4 1.4 1.4-1.4 1.4z" fill="#C9A56A"/>
<text x="100" y="187.6" text-anchor="middle" font-size="32" font-weight="700" fill="#fff" fill-opacity=".85" text-rendering="geometricPrecision" style="font-family:'Canela Arabic','Markazi Text',serif">عسولة</text>
<text x="100" y="187" text-anchor="middle" font-size="32" font-weight="700" fill="#715035" text-rendering="geometricPrecision" style="font-family:'Canela Arabic','Markazi Text',serif">عسولة</text>
<text x="100" y="205" text-anchor="middle" font-size="11" fill="#8A6B3A" text-rendering="geometricPrecision" style="font-family:'Dahab Arabic ITF','IBM Plex Sans Arabic',sans-serif">عسل جبلي</text>
<use href="#sk" fill="url(#lf)" stroke="#6B4A26" stroke-opacity=".62" stroke-width="1"/><use href="#sk" fill="url(#bl)"/><use href="#sk" fill="url(#sh)"/><use href="#sk" fill="url(#lv)"/>
<g clip-path="url(#kc)">${folds}<path d="M64 26.4Q100 17.4 136 26.4" stroke="#fff" stroke-opacity=".38" stroke-width="1.8" fill="none" stroke-linecap="round"/><use href="#sk" fill="none" stroke="#3A2A14" stroke-opacity=".3" stroke-width="2.4" transform="translate(0 -.3)"/><use href="#sk" fill="none" stroke="#F3E3B0" stroke-opacity=".45" stroke-width=".7" stroke-dasharray="1.6 1.3" transform="translate(0 -2.8)"/></g>
<path d="${TW}" stroke="#2A1608" stroke-opacity=".3" stroke-width="4.4" fill="none" stroke-linecap="round" transform="translate(0 2.2)"/>
<path d="${TW}" stroke="#6B4A26" stroke-width="4.5" fill="none" stroke-linecap="round"/><path d="${TW}" stroke="#4A3018" stroke-width="1" stroke-opacity=".5" fill="none" transform="translate(0 1.4)"/>
<path d="${ticks}" stroke="#C9A56A" stroke-opacity=".7" stroke-width=".8" stroke-linecap="round" fill="none"/><path d="${TW}" stroke="#F3E3B0" stroke-opacity=".34" stroke-width=".7" fill="none" transform="translate(0 -1.5)"/>
<path d="${BOW}" fill="none" stroke="#2A1608" stroke-opacity=".28" stroke-width="3" stroke-linecap="round" transform="translate(.6 1.2)"/>
<path d="${BOW}" fill="none" stroke="#6B4A26" stroke-width="3" stroke-linecap="round"/><path d="${BOW}" fill="none" stroke="#C9A56A" stroke-opacity=".85" stroke-width=".8" stroke-dasharray="1.2 1.1" stroke-linecap="butt"/><path d="${BOW}" fill="none" stroke="#F3E3B0" stroke-opacity=".3" stroke-width=".5" transform="translate(-.5 -.7)"/>
<path d="${FRAY}" stroke="#6B4A26" stroke-width=".7" stroke-linecap="round" fill="none"/>
<ellipse cx="148" cy="57.6" rx="3.1" ry="3.3" fill="url(#kn)" stroke="#3A2A14" stroke-opacity=".5" stroke-width=".5"/><path d="M146.3 56.2q1.7-1.4 3.4-.2" stroke="#F3E3B0" stroke-opacity=".55" stroke-width=".6" fill="none" stroke-linecap="round"/>
</g>`;
// honey wave group (JS fills the jar svgs with this): moving group so the gradient overlay travels with the wave
const WAVE="M-80 94q20-8 40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0V262H-80z";
const BS="fill:url(#bu);stroke:#fff;stroke-opacity:.6;stroke-width:.5";
const DRIP="M122 76c0 14 4 20 4 34a8 8 0 0 1-16 0c0-14 4-18 4-34z";
export const J=`<use href="#jb"/><g clip-path="url(#jc)"><g class="wv"><path style="fill:var(--c);fill-opacity:.95;stroke:#fff;stroke-opacity:.4;stroke-width:1.5" d="${WAVE}"/><path fill="url(#hv)" d="${WAVE}"/><path d="M-80 95.6q20-8 40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0" fill="none" stroke="#fff" stroke-opacity=".38" stroke-width="2.6"/><path d="M-80 93.6q20-8 40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width=".8"/></g><circle class="bb" style="${BS}" cx="64" cy="228" r="3"/><circle class="bb" style="animation-delay:-3s;${BS}" cx="124" cy="214" r="2.4"/><circle class="bb" style="animation-delay:-5s;${BS}" cx="150" cy="236" r="2"/><circle class="bb" style="animation-delay:-1.5s;${BS}" cx="92" cy="240" r="1.5"/><circle class="bb" style="animation-delay:-6s;${BS}" cx="40" cy="210" r="1.7"/></g><g class="dr"><path style="fill:var(--c);stroke:#fff;stroke-opacity:.38;stroke-width:1.4" d="${DRIP}"/><path fill="url(#dg)" d="${DRIP}"/><path d="M113.6 98c.4 5 .4 9 .6 12.4" stroke="#fff" stroke-opacity=".6" stroke-width="1.8" stroke-linecap="round" fill="none"/><circle cx="117.2" cy="115.4" r="1" fill="#fff" fill-opacity=".7"/></g><use href="#jf"/>`;

// ---------- BEE (viewBox 56x56, faces right) ----------
export const beeArt=(flap=true)=>{const c=flap?' class="wg"':'';return `<g${c}><ellipse cx="33.5" cy="11" rx="7.6" ry="12" transform="rotate(16 33.5 11)" fill="url(#wgd)" fill-opacity=".6" stroke="#9DB095" stroke-width=".8" stroke-opacity=".8"/></g><g${c}><ellipse cx="26" cy="12" rx="10" ry="14" fill="url(#wgd)" fill-opacity=".85" stroke="#9DB095" stroke-width=".9"/><path d="M26 25C25.4 18 25 11 25.6 1.5M26 22C22 18 19 13 18 7.5M26 22C30 17 32 12 32 7M26 14.5l-4.2-3.4M26 14.5l4 -2.6" fill="none" stroke="#9DB095" stroke-width=".5" stroke-opacity=".75" stroke-linecap="round"/><ellipse cx="21.6" cy="9" rx="2" ry="6.4" transform="rotate(14 21.6 9)" fill="#fff" fill-opacity=".6"/></g><path d="M12 36q-4 5-3 11M23 41.5q-1 5.5-3.6 8.4M31 41.5q1.6 4.5 4.6 7.4" fill="none" stroke="#3A2A14" stroke-width="1.2" stroke-linecap="round"/><ellipse cx="26" cy="31" rx="17" ry="12" fill="url(#bbg)" stroke="#3A2A14" stroke-opacity=".5" stroke-width=".6"/><path d="M19 20.5Q23 31 19 41.5M30 19.5Q34 31 30 42" stroke="#3A2A14" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M12.6 24.4c3-3.6 7.6-5 11-4.6" fill="none" stroke="#3A2A14" stroke-width="3.6" stroke-linecap="round" stroke-opacity=".0"/><ellipse cx="24" cy="24.4" rx="9.4" ry="3" transform="rotate(-9 24 24.4)" fill="#fff" fill-opacity=".32"/><path d="M11 34.5c4 6.4 17 9.4 27 4.4" fill="none" stroke="#7A4A0A" stroke-opacity=".22" stroke-width="2.4" stroke-linecap="round"/><path d="M8 31L1 33L8 35Z" fill="#3A2A14"/><path d="M8 31.6L3 33" stroke="#7A5A2E" stroke-width=".5" stroke-linecap="round"/><circle cx="46" cy="29" r="8" fill="url(#bhd)"/><circle cx="49" cy="27" r="2.2" fill="#fff"/><circle cx="49.4" cy="27.4" r="1" fill="#1B1208"/><circle cx="47.2" cy="31.6" r=".8" fill="#fff" fill-opacity=".5"/><path d="M49.4 33q2 .8 3.6-.4" fill="none" stroke="#B98A43" stroke-width=".7" stroke-linecap="round" stroke-opacity=".8"/><path d="M48.6 21.6Q50 15 55.4 13.4M45 21.6Q44.6 15.6 41 12.6" fill="none" stroke="#3A2A14" stroke-width="1" stroke-linecap="round"/><circle cx="55.6" cy="13.3" r="1.1" fill="#3A2A14"/><circle cx="40.8" cy="12.4" r="1" fill="#3A2A14"/>`};
export const BEE=`<svg viewBox="0 0 56 56" aria-hidden="true">${beeArt(true)}</svg>`;

// ---------- LOGO (viewBox 48) ----------
export const LOGO=`<svg class="lg" viewBox="0 0 48 48" aria-hidden="true" overflow="visible"><circle cx="22" cy="27" r="19" fill="url(#gg)"/><circle cx="22" cy="27" r="18.6" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width=".7"/><ellipse cx="16" cy="17" rx="10" ry="6" transform="rotate(-28 16 17)" fill="#fff" fill-opacity=".2"/><path d="M5.2 32a17 17 0 0 0 31.2 6" fill="none" stroke="#8A6B3A" stroke-opacity=".35" stroke-width="1.4" stroke-linecap="round"/><text x="22" y="30" text-anchor="middle" font-size="33" font-weight="700" fill="#1B241A" text-rendering="geometricPrecision" style="font-family:'Canela Arabic','Markazi Text',serif">ع</text><g transform="translate(37.5 9.5) rotate(18) scale(.3) translate(-26 -31)">${beeArt(false)}</g></svg>`;

// ---------- standalone SVGs for icons (text kept as <text>, fonts loaded by renderer) ----------
export const JAR_STANDALONE=(c="#E0A93B")=>`<svg viewBox="0 0 200 260" style="--c:${c};width:100%;height:100%;overflow:visible">${J}</svg>`;

// ---------- WILDFLOWERS (symbols, viewBox 60x84, ground at y=84) ----------
const rot=(cx,cy,i,N,off=0)=>`rotate(${n(off+i*360/N)} ${cx} ${cy})`;
const leaf=(d,id)=>`<path d="${d}" fill="url(#lg)" stroke="#3F5B35" stroke-opacity=".45" stroke-width=".5"/>`;
const stemG=`<path d="M30 30C29 50 31 66 30 85" stroke="#4E6B42" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M30.4 30C29.4 50 31.4 66 30.4 85" stroke="#8FB07A" stroke-opacity=".55" stroke-width=".8" fill="none" stroke-linecap="round"/>`;
let daisyP="",daisyP2="";for(let i=0;i<13;i++)daisyP+=`<ellipse cx="30" cy="8.6" rx="3.5" ry="8.2" transform="${rot(30,20,i,13)}"/>`;
for(let i=0;i<13;i++)daisyP2+=`<ellipse cx="30" cy="10" rx="3.2" ry="7" transform="${rot(30,20,i,13,13.8)}"/>`;
let cal1="",cal2="";for(let i=0;i<14;i++)cal1+=`<ellipse cx="30" cy="12.2" rx="3.3" ry="8.6" transform="${rot(30,22,i,14)}"/>`;
for(let i=0;i<10;i++)cal2+=`<ellipse cx="30" cy="14.8" rx="2.8" ry="6" transform="${rot(30,22,i,10,18)}"/>`;
let tuft="",tuftL="";for(let i=-9;i<=9;i++){const a=i*7.2*Math.PI/180,L=12.5+Math.cos(i*.32)*4.2+(i%2?1.2:-.6),x1=30+Math.sin(a)*2,y1=24,x2=30+Math.sin(a)*L,y2=24-Math.cos(a)*L;tuft+=`M${n(x1)} ${y1}L${n(x2)} ${n(y2)}`;tuftL+=`M${n(30+Math.sin(a)*(L*.45+2))} ${n(24-Math.cos(a)*L*.45)}L${n(x2)} ${n(y2)}`}
let hatch="";for(let i=-12;i<=12;i+=3.4)hatch+=`M${n(30+i-7)} 21l14 14M${n(30+i+7)} 21l-14 14`;
export const FLOWER_DEFS=`
<linearGradient id="lg" x2="1" y2="1"><stop stop-color="#9BBB84"/><stop offset="1" stop-color="#587A4A"/></linearGradient>
<linearGradient id="pt" x2="0" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#F3E3B0"/></linearGradient>
<radialGradient id="dc" cx=".38" cy=".3" r=".8"><stop stop-color="#FBD66E"/><stop offset=".6" stop-color="#E0A93B"/><stop offset="1" stop-color="#B97A15"/></radialGradient>
<linearGradient id="tg" x2="1" y2="1"><stop stop-color="#8FB07A"/><stop offset="1" stop-color="#4E6B42"/></linearGradient>
<linearGradient id="tp" x2="0" y2="1"><stop stop-color="#D8B0E4"/><stop offset="1" stop-color="#9A66B3"/></linearGradient>
<radialGradient id="cc" cx=".4" cy=".35" r=".8"><stop stop-color="#8A5A28"/><stop offset="1" stop-color="#3A2A14"/></radialGradient>
<linearGradient id="op" x2="0" y2="1"><stop stop-color="#F6C85C"/><stop offset="1" stop-color="#D98A22"/></linearGradient>
<clipPath id="tc"><ellipse cx="30" cy="29" rx="8" ry="7.4"/></clipPath>
<symbol id="fa" viewBox="0 0 60 84" overflow="visible">${stemG}${leaf("M30 68C20 68 13.5 62 11 53C20.5 55 27 59.5 30 68Z")}${leaf("M30.4 58C39.5 57 45.6 51 47.6 43.5C38.4 45.4 32.4 49.6 30.4 58Z")}
<g fill="url(#pt)" stroke="#C9A56A" stroke-opacity=".55" stroke-width=".45">${daisyP}</g><g fill="#fff" stroke="#C9A56A" stroke-opacity=".4" stroke-width=".4" fill-opacity=".92">${daisyP2}</g>
<circle cx="30" cy="20" r="5.8" fill="url(#dc)" stroke="#8A5A28" stroke-opacity=".5" stroke-width=".5"/><circle cx="30" cy="20" r="3.4" fill="none" stroke="#8A5A28" stroke-opacity=".35" stroke-width=".5" stroke-dasharray=".8 1"/><ellipse cx="28.2" cy="18" rx="2" ry="1.3" fill="#fff" fill-opacity=".5"/></symbol>
<symbol id="fb" viewBox="0 0 60 84" overflow="visible">${stemG}<path d="M30 72L22.6 68.6L25 65L17 61.2L19.6 57.4L12 52.4C22 54.6 28.4 62 30 72Z" fill="url(#lg)" stroke="#3F5B35" stroke-opacity=".45" stroke-width=".5" stroke-linejoin="round"/><path d="M30.4 62L38 58.6L35.8 55L43.6 51.4L41 47.6L48.4 43C38.6 45.2 32.4 52 30.4 62Z" fill="url(#lg)" stroke="#3F5B35" stroke-opacity=".45" stroke-width=".5" stroke-linejoin="round"/>
<path d="${tuft}" stroke="#8E5BA8" stroke-width="2.3" stroke-linecap="round" fill="none"/><path d="${tuftL}" stroke="url(#tp)" stroke-width="1.3" stroke-linecap="round" fill="none"/>
<ellipse cx="30" cy="29" rx="8" ry="7.4" fill="url(#tg)" stroke="#3F5B35" stroke-opacity=".6" stroke-width=".6"/><g clip-path="url(#tc)"><path d="${hatch}" stroke="#2F4A28" stroke-opacity=".5" stroke-width=".55" fill="none"/></g><ellipse cx="27.4" cy="26.4" rx="2.6" ry="1.5" fill="#fff" fill-opacity=".28"/></symbol>
<symbol id="fc" viewBox="0 0 60 84" overflow="visible">${stemG}${leaf("M30 70C17.5 70 10 63 7.6 52C19 55.4 26.6 60.6 30 70Z")}${leaf("M30.4 60C42 59 49.6 52.6 52 42.6C41 45.2 33.4 50.4 30.4 60Z")}
<g fill="url(#op)" stroke="#B97A15" stroke-opacity=".6" stroke-width=".4">${cal1}</g><g fill="#F9D878" stroke="#C98A1E" stroke-opacity=".5" stroke-width=".35">${cal2}</g>
<circle cx="30" cy="22" r="4.6" fill="url(#cc)"/><circle cx="30" cy="22" r="2.6" fill="none" stroke="#E0A93B" stroke-opacity=".5" stroke-width=".5" stroke-dasharray=".7 .9"/><ellipse cx="28.6" cy="20.4" rx="1.6" ry="1" fill="#fff" fill-opacity=".4"/></symbol>`;
const FH={fa:".5,.238",fb:".5,.226",fc:".5,.262"};
export const flower=(t,style)=>`<svg class="fw" viewBox="0 0 60 84" aria-hidden="true" data-h="${FH[t]}" style="${style}"><use href="#${t}" width="60" height="84"/></svg>`;
export const ALL_DEFS=()=>DEFS()+FLOWER_DEFS;
