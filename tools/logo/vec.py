# Vectorise the extracted logo: iso-luminance layers (true colours) traced with potrace (smooth bezier), stacked from dark silhouette to highlights.
import numpy as np,cv2,sys,json
from PIL import Image
import potrace
SL=float(sys.argv[1]);SR=float(sys.argv[2]);QS=[float(v) for v in sys.argv[3].split(',')];K=len(QS)-1;OUT=sys.argv[4];TURD=int(sys.argv[5])
rgba=np.array(Image.open('logo_full.png')).astype(np.float32)
S=2  # trace at half resolution
def down(x):return cv2.resize(x,(x.shape[1]//S,x.shape[0]//S),interpolation=cv2.INTER_AREA)
rgb=down(rgba[...,:3]*(rgba[...,3:4]/255));a=down(rgba[...,3]/255)
fg=np.where(a[...,None]>0.05,rgb/np.maximum(a[...,None],1e-3),0)
H,W=a.shape
L=fg@np.array([.299,.587,.114],np.float32)
# mountain = lowest connected component (separate file variants)
m=(a>0.5).astype(np.uint8);n,lab,st,cent=cv2.connectedComponentsWithStats(m,8)
mtn=np.zeros(n,bool)
for i in range(1,n):
    if st[i,1]>H*0.78 and st[i,4]>2000:mtn[i]=True   # component starting in the lowest part = mountains
mtn_mask=mtn[lab]
# bee-only selection: components of the mask inside the bee's bounding box (area filter drops the dashed-path fragments)
bee=np.zeros((H,W),bool)
for i in range(1,n):
    x,y,w,h,ar=st[i]
    if x>=585 and x+w<=800 and y<=230 and ar>350:bee|=(lab==i)
bee=cv2.dilate(bee.astype(np.uint8),np.ones((9,9),np.uint8)).astype(bool)&(a>0.05)
def trace(bm,turd=TURD,alphamax=1.0,opt=0.5):
    pl=potrace.Bitmap(~bm).trace(turdsize=turd,turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY,alphamax=alphamax,opticurve=True,opttolerance=opt)
    d=[]
    f=lambda p:f"{p.x:.1f} {p.y:.1f}"
    for c in pl:
        d.append("M"+f(c.start_point))
        for s in c.segments:
            if s.is_corner:d.append("L"+f(s.c)+"L"+f(s.end_point))
            else:d.append("C"+f(s.c1)+" "+f(s.c2)+" "+f(s.end_point))
        d.append("Z")
    return "".join(d)
def build(sel,name):
    wm=(a>0.5).astype(np.float32);Ls=cv2.GaussianBlur(L*wm,(0,0),SL)/np.maximum(cv2.GaussianBlur(wm,(0,0),SL),1e-3)
    inside=(a>0.5)&sel
    vals=Ls[inside&(a>0.9)]
    qs=np.quantile(vals,QS)
    layers=[]
    sil=cv2.GaussianBlur(a,(0,0),0.7)>0.5
    sil&=sel
    cols=[]
    for i in range(K):
        lo=qs[i];hi=qs[i+1]
        band=inside&(a>0.9)&(Ls>=lo)&(Ls<=hi if i==K-1 else Ls<hi)
        c=fg[band].mean(0) if band.sum()>20 else fg[inside].mean(0)
        cols.append(c)
    for i in range(K):
        reg=sil if i==0 else (sil&(Ls>=qs[i]))
        reg=cv2.morphologyEx(reg.astype(np.uint8),cv2.MORPH_OPEN,np.ones((2,2),np.uint8))
        if i>0:reg=cv2.GaussianBlur(reg.astype(np.float32),(0,0),SR)>0.5
        layers.append(trace(reg.astype(bool)))
    return layers,cols,sil
res={}
for name,sel in [('bee',bee),('full',np.ones((H,W),bool)),('compact',~cv2.dilate(mtn_mask.astype(np.uint8),np.ones((3,3),np.uint8)).astype(bool))]:
    layers,cols,sil=build(sel,name)
    ys,xs=np.nonzero(sil);x0,y0,x1,y1=xs.min()-3,ys.min()-3,xs.max()+4,ys.max()+4
    res[name]=dict(layers=layers,cols=[[int(v) for v in c] for c in cols],box=[int(x0),int(y0),int(x1-x0),int(y1-y0)])
    print(name,res[name]['box'],[ '#%02x%02x%02x'%tuple(int(v) for v in c) for c in cols],sum(len(l) for l in layers)//1024,'KB paths')
json.dump(res,open(OUT,'w'))
