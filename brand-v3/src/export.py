import numpy as np,cv2,os
from PIL import Image
from scipy import ndimage as ndi
r=np.load('/tmp/rgba_p.npy');G=np.load('/tmp/G.npy')
out='/workspace/asoula/brand-v3'
os.makedirs(out+'/site',exist_ok=True)
# nearest-group label for every pixel
d,(iy,ix)=ndi.distance_transform_edt(G==0,return_indices=True)
near=G[iy,ix]
variants={'logo':[1],'logo-mountain':[1,2],'logo-tagline':[1,2,3]}
def lift(rgb,tag=None):  # for dark backgrounds: lift only the dark browns, keep gold/highlights
    f=rgb.astype(np.float32)/255
    L=f@np.array([.299,.587,.114],np.float32)
    ex=np.where(tag[...,None] if tag is not None else False,0.42,0.58)
    g=np.clip(f,0,1)**ex
    w=np.clip((0.70-L)/0.3,0,1)[...,None]       # 1 for dark, 0 for light
    return (np.clip(f*(1-w)+g*w,0,1)*255+.5).astype(np.uint8)
def save(a,name):
    im=Image.fromarray(a,'RGBA')
    im.save(f'{out}/{name}.png',optimize=True)
    im.save(f'{out}/{name}.webp',lossless=True,quality=100,method=6,exact=True)
def down(a,w):
    h=round(a.shape[0]*w/a.shape[1]);f=a.astype(np.float32);al=f[...,3:]/255
    p=np.concatenate([f[...,:3]*al,f[...,3:]],-1)
    p=cv2.resize(p,(w,h),interpolation=cv2.INTER_AREA)
    al=p[...,3:]/255;rgb=np.where(al>1e-4,p[...,:3]/np.maximum(al,1e-4),0)
    return np.clip(np.concatenate([rgb,p[...,3:]],-1)+.5,0,255).astype(np.uint8)
for name,gs in variants.items():
    a=r.copy();keep=np.isin(near,gs)&(near>0)
    a[...,3]=np.where(keep,a[...,3],0);a[a[...,3]==0,:3]=0
    ys,xs=np.where(a[...,3]>0);P=24
    y0,y1,x0,x1=max(ys.min()-P,0),ys.max()+P+1,max(xs.min()-P,0),xs.max()+P+1
    a=a[y0:y1,x0:x1];tg=(near==3)[y0:y1,x0:x1]
    print(name,a.shape)
    for tag,aa in (('',a),('-dark',np.dstack([lift(a[...,:3],tg),a[...,3]]))):
        save(aa,f'{name}{tag}')
        for w in (1600,800,400):save(down(aa,w),f'{name}{tag}-{w}')
        if name=='logo' and tag=='-dark':
            for w in (110,220,330,75,150,225):save(down(aa,w),f'site/logo-dark-{w}')
        if name=='logo' and tag=='':
            for w in (110,220,330):save(down(aa,w),f'site/logo-{w}')
