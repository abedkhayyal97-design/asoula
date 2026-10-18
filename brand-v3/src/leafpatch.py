# hand-patch of the leaf's upper-left rim: the pale glossy highlight band was cut away by the colour matte,
# leaving a notch + a sliver. Re-add the band bounded by a hand-placed smooth outer-rim curve (AA, 8x supersampled).
import numpy as np,cv2,sys
C=np.load('/tmp/crop.npy');r=np.load('/tmp/rgba.npy')
x0,y0,x1,y1=2860,740,3040,880
OUTER=np.array([(2872,850),(2890,838),(2907,823),(2921,813),(2935,805),(2949,797),(2963,790),(2975,785),(2986,781),(3000,776),(3020,770),(3040,764)],np.float32)
INNER_SHIFT=16
sm=lambda t:np.clip(t,0,1)**2*(3-2*np.clip(t,0,1))
xs=OUTER[:,0];shift=INNER_SHIFT*sm((xs-xs[0]-14)/45)*sm((xs[-1]-xs)/20)
# also start the outer curve 0.8px inside so the source hairline is not picked up
poly=np.vstack([OUTER+[0,0.8],(OUTER+np.stack([0*shift,shift],1))[::-1]])
S=8
m=np.zeros(((y1-y0)*S,(x1-x0)*S),np.uint8)
cv2.fillPoly(m,[np.round((poly-[x0,y0])*S).astype(np.int32)],255,lineType=cv2.LINE_8)
cov=cv2.resize(m,(x1-x0,y1-y0),interpolation=cv2.INTER_AREA).astype(np.float32)/255
if __name__=='__main__' and len(sys.argv)>1:
    from PIL import Image
    z=5;ref=Image.fromarray(C[y0:y1,x0:x1,:3]).resize(((x1-x0)*z,(y1-y0)*z),Image.NEAREST)
    a=np.array(ref);ov=cv2.resize(cov,(a.shape[1],a.shape[0]),interpolation=cv2.INTER_NEAREST)
    a[...,0]=np.where(ov>0.5,255,a[...,0]);a[...,1]=np.where(ov>0.5,a[...,1]*0.5,a[...,1]);Image.fromarray(a).save(sys.argv[1]);sys.exit()
a_old=r[y0:y1,x0:x1,3].astype(np.float32)/255
a_new=np.maximum(a_old,cov)
out=r.copy()
sel=(a_new>a_old+1e-3)
rgb=out[y0:y1,x0:x1,:3];src=C[y0:y1,x0:x1,:3]
rgb[sel]=src[sel]
out[y0:y1,x0:x1,:3]=rgb
out[y0:y1,x0:x1,3]=(a_new*255+.5).astype(np.uint8)
np.save('/tmp/rgba_p.npy',out)
