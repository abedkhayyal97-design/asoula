import numpy as np,cv2
from PIL import Image
from scipy import ndimage as ndi
C8=np.load('/tmp/crop.npy');G=np.load('/tmp/G.npy');l2=np.load('/tmp/l2.npy')
H,W=G.shape;C=C8.astype(np.float32);B=C[...,2]
sat=(C[...,0]-C[...,2])/np.maximum(C[...,0],1)
# ---- 1. selected mask + hole policy ----
M=(G>0)
inv=(~M).astype(np.uint8);nn,l2,s2,c2=cv2.connectedComponentsWithStats(inv,4)
bgl=np.bincount(l2.ravel()).argmax()   # outside = biggest connected background
Mf=M.copy();kept=[];filled=[]
for i in range(1,nn):
    if i==bgl:continue
    m=l2==i;a=int(s2[i,4]);x,y=int(s2[i,0]),int(s2[i,1]);s=float(sat[m].mean())
    in_drop=(480<=x<=760 and 1080<=y<=1450)
    if a<1500 or in_drop:Mf|=m;filled.append((a,x,y,round(s,2)))
    else:kept.append((a,x,y,round(s,2)))
print('filled holes',filled);print('kept (transparent) holes',kept)
# ---- 2. background model: robust polynomial fit of B on pure background ----
hardall=(B<0)  # placeholder
bgB0=cv2.GaussianBlur(cv2.dilate(B,np.ones((61,61),np.uint8)),(0,0),40)
hard=((bgB0-B)>0.45*(bgB0-95))
pure=~(ndi.binary_dilation(hard,iterations=1,structure=np.ones((3,3)))) 
pure=cv2.erode(pure.astype(np.uint8),np.ones((141,141),np.uint8))>0
ys,xs=np.nonzero(pure);idx=np.random.RandomState(0).choice(len(ys),min(60000,len(ys)),replace=False);ys,xs=ys[idx],xs[idx]
def basis(x,y,d=5):
    x=x/W*2-1;y=y/H*2-1;return np.stack([x**i*y**j for i in range(d+1) for j in range(d+1-i)],1)
A=basis(xs.astype(np.float32),ys.astype(np.float32));b=B[ys,xs];w=np.ones(len(b))
for it in range(6):
    coef,*_=np.linalg.lstsq(A*w[:,None],b*w,rcond=None);r=b-A@coef;s=r.std();w=(np.abs(r)<2.5*s).astype(float)
print('bg fit residual std',round(float(s),2),'n',len(b))
yy,xx=np.mgrid[0:H,0:W];bgB=(basis(xx.ravel().astype(np.float32),yy.ravel().astype(np.float32))@coef).reshape(H,W).astype(np.float32)
np.save('/tmp/bgB.npy',bgB)
# ---- 3. alpha from the continuous blue-drop around the hand-verified mask boundary ----
drop=bgB-B
FB=95.0
T=0.45*(bgB-FB)      # same crossing level used to find the components
alpha_c=np.clip((drop-T)/(2*28.0)+0.5,0,1)
dist_in=ndi.distance_transform_edt(Mf);dist_out=ndi.distance_transform_edt(~Mf)
alpha=alpha_c.copy()
alpha[dist_in>=4]=1.0            # solid interior (keeps glossy highlights opaque)
alpha[dist_out>2.2]=0.0

# ---- 4. de-haloed foreground colour ----
deep=(dist_in>=5).astype(np.float32)
def prop(sig):
    num=cv2.GaussianBlur(C*deep[...,None],(0,0),sig);den=cv2.GaussianBlur(deep,(0,0),sig);return num,den
n1,d1=prop(5);n2,d2=prop(14)
Fp=np.where(d1[...,None]>2e-3,n1/np.maximum(d1[...,None],1e-6),np.where(d2[...,None]>1e-4,n2/np.maximum(d2[...,None],1e-6),C))
wk=np.clip((dist_in-0.5)/4.0,0,1);wk=wk*wk*(3-2*wk)   # 0 at edge → 1 four px inside
wk[~Mf]=0
F=C*wk[...,None]+Fp*(1-wk[...,None])
# group masks (variants)
Gd=G.copy()
def gm(groups,grow=10):
    m=np.isin(Gd,groups)|(np.isin(Gd,groups)==0)&False
    mm=m|(Mf&ndi.binary_dilation(m,iterations=14)&(Gd==0))   # filled holes belong to the neighbouring group
    return ndi.binary_dilation(mm,iterations=grow)
rgba=np.dstack([np.clip(F,0,255),alpha*255]).astype(np.uint8)
np.save('/tmp/rgba.npy',rgba);np.save('/tmp/Mf.npy',Mf)
Image.fromarray(rgba,'RGBA').save('/tmp/master.png')
print('ok',rgba.shape)
