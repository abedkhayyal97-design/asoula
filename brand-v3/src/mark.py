import numpy as np,cv2
from PIL import Image
from scipy import ndimage as ndi
r=np.load('/tmp/rgba_p.npy');G=np.load('/tmp/G.npy')
def comp_filter(box,minL=None,keep_largest=True):
    x0,y0,x1,y1=box;a=r[y0:y1,x0:x1].copy()
    m=a[...,3]>10
    if minL is not None:
        f=a[...,:3].astype(np.float32)/255;L=f@np.array([.299,.587,.114])
        m&=(L>minL)|(a[...,3]<250)&False
    lab,n=ndi.label(m)
    if keep_largest and n:
        sz=ndi.sum(m,lab,range(1,n+1));m=lab==(1+int(np.argmax(sz)))
    a[...,3]=np.where(m,a[...,3],0);a[a[...,3]==0,:3]=0
    ys,xs=np.where(a[...,3]>0);return a[ys.min():ys.max()+1,xs.min():xs.max()+1]
bee=comp_filter((1355,95,1735,560))
# bee = body+wings(+antennae) pieces: keep all comps there instead of largest
def keep_all(box):
    x0,y0,x1,y1=box;a=r[y0:y1,x0:x1].copy();m=a[...,3]>0
    ys,xs=np.where(m);return a[ys.min():ys.max()+1,xs.min():xs.max()+1]
bee=keep_all((1355,100,1735,555))
lab,n=ndi.label(bee[...,3]>0)
for i,sl in enumerate(ndi.find_objects(lab),1):
    ar=(lab[sl]==i).sum()
    if ar<300 or sl[1].start==0 or sl[1].stop==bee.shape[1]:
        bee[...,3][lab==i]=0
bee[bee[...,3]==0,:3]=0
ys,xs=np.where(bee[...,3]>0);bee=bee[ys.min():ys.max()+1,xs.min():xs.max()+1]
Image.fromarray(bee,'RGBA').save('/tmp/mark_bee.png')
# drop: amber pixels only, below neck start
x0,y0,x1,y1=470,1095,770,1455
a=r[y0:y1,x0:x1].copy();f=a[...,:3].astype(np.float32)/255
L=f@np.array([.299,.587,.114]);sat=f.max(-1)-f.min(-1)
m=(a[...,3]>0)&((L>0.5)|(a[...,3]<250))
lab,n=ndi.label(m&(a[...,3]>128));sz=ndi.sum(m,lab,range(1,n+1));k=lab==(1+int(np.argmax(sz)))
k=ndi.binary_dilation(k,iterations=2)&(a[...,3]>0)
a[...,3]=np.where(k,a[...,3],0);a[a[...,3]==0,:3]=0
ys,xs=np.where(a[...,3]>0);drop=a[ys.min():ys.max()+1,xs.min():xs.max()+1]
Image.fromarray(drop,'RGBA').save('/tmp/mark_drop.png');print(bee.shape,drop.shape)

np.save('/tmp/mk_bee.npy',bee);np.save('/tmp/mk_drop.npy',drop)
