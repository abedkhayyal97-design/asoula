import numpy as np,cv2,io,base64,os
from PIL import Image,ImageDraw
V='/workspace/asoula/brand-v3'
D='/workspace/asoula/docs'
GREEN=(27,36,26);CREAM=(247,242,232)
def prem_resize(im,size):
    a=np.asarray(im.convert('RGBA'),np.float32);al=a[...,3:]/255
    p=np.concatenate([a[...,:3]*al,a[...,3:]],-1)
    p=cv2.resize(p,size,interpolation=cv2.INTER_AREA if size[0]<im.width else cv2.INTER_CUBIC)
    al=p[...,3:]/255;rgb=np.where(al>1e-4,p[...,:3]/np.maximum(al,1e-4),0)
    return Image.fromarray(np.clip(np.concatenate([rgb,p[...,3:]],-1)+.5,0,255).astype(np.uint8),'RGBA')
def fit(im,w=None,h=None):
    s=min((w or 1e9)/im.width,(h or 1e9)/im.height);return prem_resize(im,(max(1,round(im.width*s)),max(1,round(im.height*s))))
def square(bg,size,radius=0):
    c=Image.new('RGBA',(size,size),(0,0,0,0))
    d=ImageDraw.Draw(c);d.rounded_rectangle((0,0,size-1,size-1),radius=radius,fill=bg+(255,));return c
def over(base,fg,cx,cy):
    base.alpha_composite(fg,(round(cx-fg.width/2),round(cy-fg.height/2)));return base
logo_dark=Image.open(f'{V}/logo-dark.png').convert('RGBA')
logo_tag=Image.open(f'{V}/logo-tagline.png').convert('RGBA')
bee=Image.fromarray(np.load('/tmp/mk_bee.npy'),'RGBA');drop=Image.fromarray(np.load('/tmp/mk_drop.npy'),'RGBA')
# ---- favicon mark: bee (big, upper-left) + drop (lower-right), on rounded dark-green tile
def mark(size,radius_frac=0.22):
    S=size*4
    t=square(GREEN,S,int(S*radius_frac))
    b=fit(bee,h=S*0.60);d=fit(drop,h=S*0.50)
    t.alpha_composite(b,(round(S*0.10),round(S*0.12)))
    t.alpha_composite(d,(round(S*0.64),round(S*0.40)))
    return prem_resize(t,(size,size))
M512=mark(512)
M512.save(f'{V}/site/mark-512.png')
for n in (32,64):mark(n).save(f'{D}/favicon-{n}.png',optimize=True)
ico=[mark(n) for n in (16,32,48)]
ico[2].save(f'{D}/favicon.ico',sizes=[(16,16),(32,32),(48,48)],append_images=ico[:2])
buf=io.BytesIO();mark(96).save(buf,'PNG',optimize=True);b64=base64.b64encode(buf.getvalue()).decode()
open(f'{D}/favicon.svg','w').write(f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 96 96" width="96" height="96"><title>عسولة</title><image width="96" height="96" href="data:image/png;base64,{b64}" xlink:href="data:image/png;base64,{b64}"/></svg>')
# ---- app icons: full logo (no tagline) on dark green; maskable has a bigger safe zone
def icon(size,logo_w_frac,bg=GREEN,radius=0,logo=logo_dark):
    S=size*2;c=square(bg,S,radius)
    l=fit(logo,w=S*logo_w_frac);over(c,l,S/2,S/2)
    return prem_resize(c,(size,size))
for n in (192,512,1024):icon(n,0.84).save(f'{D}/icon-{n}.png',optimize=True)
icon(512,0.60).save(f'{D}/icon-maskable-512.png',optimize=True)
icon(180,0.84).convert('RGB').save(f'{D}/apple-touch-icon.png',optimize=True) if False else None
a=icon(180,0.84);flat=Image.new('RGB',a.size,GREEN);flat.paste(a,mask=a.split()[3]);flat.save(f'{D}/apple-touch-icon.png',optimize=True)
# icons with transparent corners from square() -> flatten the full-bleed ones (radius 0 -> already opaque)
# ---- OG image: NOT generated here any more (the logo pixels carry a misspelled tagline 'جبلى').
# See brand-v3/og/og.html + render.js: tagline-less logo-mountain + real typeset tagline 'عسل جبلي أصيل' (Cairo 700).
print('ok')
