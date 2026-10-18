import numpy as np,cv2
from PIL import Image
Image.MAX_IMAGE_PIXELS=None
img=np.array(Image.open('logo_crop.png').convert('RGB')).astype(np.float32)
H,W=img.shape[:2];s=3.145
B=img[...,2];R=img[...,0];G=img[...,1]
# local background estimate (cream): large median of bright pixels -> use blue channel closing
bgB=cv2.GaussianBlur(cv2.dilate(B,np.ones((61,61),np.uint8)),(0,0),40)
a=np.clip((bgB-12-B)/(bgB-12-95),0,1)
# exclusions (thumb coords -> px): other artwork
keep=np.ones((H,W),np.uint8)
def ex(x0,y0,x1,y1):keep[int(y0*s):int(y1*s),int(x0*s):int(x1*s)]=0
ex(0,0,125,160);ex(870,0,1024,205);ex(650,0,800,34);ex(0,486,1024,524);ex(0,0,1024,34)
a*=keep
m=(a>0.5).astype(np.uint8)
n,lab,st,_=cv2.connectedComponentsWithStats(m,8)
big=np.zeros(n,bool)
for i in range(1,n):
    if st[i,4]>=120:big[i]=True
cm=big[lab]
# remove specks from soft alpha: dilate kept components a bit
cmd=cv2.dilate(cm.astype(np.uint8),np.ones((9,9),np.uint8))>0
a=a*cmd
np.save('alpha.npy',a.astype(np.float32))
Image.fromarray((a*255).astype(np.uint8)).save('alpha.png')
t=Image.fromarray((a*255).astype(np.uint8));t.thumbnail((1400,1400));t.save('/tmp/alpha_small.png')
print(n,big.sum())

# ---- refinements: drop out tagline remnants, fill the honey-drop interior, build RGBA ----
keep2=np.ones((H,W),np.uint8);keep2[int(481*s):,:]=0
a=a*keep2
m=(a>0.5).astype(np.uint8)
# fill drop (thumb bbox) with its external contour
x0,y0,x1,y1=[int(v*s) for v in (140,325,235,452)]
sub=m[y0:y1,x0:x1].copy();cs,_=cv2.findContours(sub,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_NONE)
filled=np.zeros_like(sub)
for c in cs:
    if cv2.contourArea(c)>3000:cv2.drawContours(filled,[c],-1,1,-1)
add=(filled>0)&(sub==0)
a[y0:y1,x0:x1][add]=1.0
# remove remaining small specks again
m2=(a>0.5).astype(np.uint8);n,lab,st,_=cv2.connectedComponentsWithStats(m2,8)
good=np.zeros(n,bool)
for i in range(1,n):good[i]=st[i,4]>=150
a=a*(cv2.dilate(good[lab].astype(np.uint8),np.ones((7,7),np.uint8))>0)
# solid interior: closing fills highlight pinholes, interior alpha forced to 1 so interior colours are the real pixels
mb=(a>0.5).astype(np.uint8)
cl=cv2.morphologyEx(mb,cv2.MORPH_CLOSE,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(9,9)))
inner=cv2.erode(cl,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(9,9)))>0
a=np.maximum(a,inner.astype(np.float32))
# foreground colour (un-premultiply against local cream bg, only on the soft edge band)
bg=np.array([254,243,215],np.float32)
aa=np.clip(a,1e-3,1)[...,None]
fg=np.clip((img-(1-aa)*bg)/aa,0,255)
# inside the filled drop keep the original pixel colour
rgba=np.dstack([fg,(a*255)[...,None]]).astype(np.uint8)
ys,xs=np.nonzero(a>0.02);bx0,by0,bx1,by1=xs.min()-12,ys.min()-12,xs.max()+13,ys.max()+13
rgba=rgba[by0:by1,bx0:bx1]
Image.fromarray(rgba,'RGBA').save('logo_full.png');print('bbox',rgba.shape)
np.save('alpha_final.npy',a[by0:by1,bx0:bx1])
