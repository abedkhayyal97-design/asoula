import numpy as np,cv2,json
from PIL import Image,ImageDraw
Image.MAX_IMAGE_PIXELS=None
X0,Y0,X1,Y1=560,1300,3780,3060
img=np.array(Image.open('/workspace/asoula/assets-src/brand.jpg').convert('RGB').crop((X0,Y0,X1,Y1)))
np.save('/tmp/crop.npy',img)
H,W=img.shape[:2];print(W,H)
C=img.astype(np.float32)
B=C[...,2]
# coarse bg estimate for threshold only
bgB=cv2.GaussianBlur(cv2.dilate(B,np.ones((61,61),np.uint8)),(0,0),40)
hard=((bgB-B)>0.45*(bgB-95)).astype(np.uint8)
n,lab,st,cen=cv2.connectedComponentsWithStats(hard,8)
rows=[]
for i in range(1,n):
    x,y,w,h,a=st[i]
    if a>=400:rows.append((i,int(x),int(y),int(w),int(h),int(a)))
print(len(rows))
for r in rows:print(r)
np.save('/tmp/lab.npy',lab)
# labelled overview
S=0.4
vis=Image.fromarray(img).resize((int(W*S),int(H*S)),Image.LANCZOS);d=ImageDraw.Draw(vis)
for i,x,y,w,h,a in rows:
    d.rectangle((x*S,y*S,(x+w)*S,(y+h)*S),outline=(255,0,0));d.text((x*S+2,y*S+2),str(i),fill=(0,0,255))
vis.save('/tmp/overview.png');print(vis.size)
