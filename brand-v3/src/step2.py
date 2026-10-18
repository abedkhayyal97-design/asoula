import numpy as np,cv2
from PIL import Image
Image.MAX_IMAGE_PIXELS=None
X0,Y0,X1,Y1=560,1300,3780,3120
img=np.array(Image.open('/workspace/asoula/assets-src/brand.jpg').convert('RGB').crop((X0,Y0,X1,Y1)));np.save('/tmp/crop.npy',img)
H,W=img.shape[:2];C=img.astype(np.float32);B=C[...,2]
bgB=cv2.GaussianBlur(cv2.dilate(B,np.ones((61,61),np.uint8)),(0,0),40)
hard=((bgB-B)>0.45*(bgB-95)).astype(np.uint8)
n,lab,st,cen=cv2.connectedComponentsWithStats(hard,8)
# group by hand-defined regions (crop coords): rules on component bbox/centroid; everything else is excluded
groups=np.zeros(n,np.uint8)  # 0 excluded, 1 logo(main), 2 mountain, 3 tagline
names={1:'logo',2:'mountain',3:'tagline'}
def inb(i,x0,y0,x1,y1):
    x,y,w,h,a=st[i];return x>=x0 and y>=y0 and x+w<=x1 and y+h<=y1
for i in range(1,n):
    x,y,w,h,a=st[i];cx,cy=cen[i]
    if a<30:continue
    if inb(i,170,100,3130,1420) and not (cy<110 and cx>2150) and a>=400 and not (x<=40) : groups[i]=1   # main lettering, bee parts, diamonds, leaf, crescent
    # dashes of the flight path (small comps) inside the hand-defined path window
    if a>=30 and 1380<=cx<=2140 and 95<=cy<=745 and groups[i]==0 and not inb(i,1380,95,1480,160):
        m=(lab[y:y+h,x:x+w]==i).astype(np.uint8);r=cv2.distanceTransform(m,cv2.DIST_L2,5).max()
        if r>=2.6 and a>=60:groups[i]=1    # real dashes are solid blobs; the source's hairline outlines are ~2px thin
        else:print('dropped speck',i,st[i],round(float(r),1))
    if inb(i,1100,1280,2230,1505) and a>=2000 and y>1280:groups[i]=2
    if inb(i,300,1500,3000,1800) and a>=400 and (y>=1500):groups[i]=3
    if inb(i,690,1500,3020,1800) and a>=60 and y>=1500:groups[i]=3
# drip at far left (comp at x<=40) and photo elements stay excluded
G=groups[lab]
np.save('/tmp/G.npy',G)
for g in (1,2,3):print(names[g],int(((groups==g)).sum()),'comps',int((G==g).sum()),'px')
# exclusions report
for i in range(1,n):
    if st[i,4]>=1500 and groups[i]==0:print('EXCLUDED',i,st[i])
# holes
M=(G>0).astype(np.uint8)
inv=1-M;nn,l2,s2,c2=cv2.connectedComponentsWithStats(inv,4)
bgl=l2[0,0]
sat=(C[...,0]-C[...,2])/np.maximum(C[...,0],1)
holes=[]
for i in range(1,nn):
    if i==bgl or s2[i,4]<8:continue
    m=l2==i
    holes.append((i,int(s2[i,0]),int(s2[i,1]),int(s2[i,4]),round(float(sat[m].mean()),2),round(float(B[m].mean()))))
# the main bg label may not be l2[0,0]; list the big ones
print('n holes',len(holes))
for h in sorted(holes,key=lambda r:-r[3])[:40]:print(h)
np.save('/tmp/l2.npy',l2)
