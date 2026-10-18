import glob,os,sys
from PIL import Image,ImageChops
D='/workspace/asoula/screenshots/'
rows=[]
for o in sorted(glob.glob(D+'cmp-orig-*.png')):
    f=os.path.basename(o)[9:-4];n=D+'cmp-new-'+f+'.png';a=Image.open(o).convert('RGB');b=Image.open(n).convert('RGB')
    if a.size!=b.size:
        rows.append((f,'SIZE %s vs %s'%(a.size,b.size)))
        m=(max(a.size[0],b.size[0]),max(a.size[1],b.size[1]));A=Image.new('RGB',m,(255,0,255));B=Image.new('RGB',m,(255,0,255));A.paste(a);B.paste(b);a,b=A,B
    d=ImageChops.difference(a,b).convert('L');px=sum(1 for v in d.getdata() if v>24);tot=a.size[0]*a.size[1]
    rows.append((f,'diff %.3f%% (%d px)'%(100*px/tot,px)))
    # side-by-side image: orig | new | diff mask
    if len(sys.argv)>1:
        s=0.5 if a.size[0]>800 else 1
        W,H=int(a.size[0]*s),int(a.size[1]*s)
        mask=d.point(lambda v:255 if v>24 else 0).convert('RGB').resize((W,H))
        o3=Image.new('RGB',(W*3+20,H),(60,60,60));o3.paste(a.resize((W,H)),(0,0));o3.paste(b.resize((W,H)),(W+10,0));o3.paste(mask,(2*W+20,0));o3.save(D+'compare-'+f+'.png')
for r in rows:print(*r)
