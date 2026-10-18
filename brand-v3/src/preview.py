import numpy as np
from PIL import Image,ImageDraw
S='/workspace/asoula/screenshots/'
def over(im,bg):
    o=Image.new('RGBA',im.size,bg+(255,));o.alpha_composite(im);return o.convert('RGB')
def sheet(name,src,bgs,fn,w=1100):
    im=Image.open(f'/workspace/asoula/brand-v3/{src}.png').convert('RGBA')
    h=round(im.height*w/im.width);im=im.resize((w,h),Image.LANCZOS)
    tiles=[over(im,b) for b in bgs]
    out=Image.new('RGB',(w*2+12,h*2+12),(255,0,255))
    for i,t in enumerate(tiles):out.paste(t,((i%2)*(w+12),(i//2)*(h+12)))
    out.save(S+fn)
bgs=[(247,242,232),(255,255,255),(31,58,43),(18,18,18)]
for v in ('logo','logo-mountain','logo-tagline'):
    sheet(v,v,bgs,f'logo-v3-{v}-backgrounds.png')
# dark-optimised on dark green / near-black vs plain
for v in ('logo','logo-tagline'):
    a=Image.open(f'/workspace/asoula/brand-v3/{v}.png').convert('RGBA');b=Image.open(f'/workspace/asoula/brand-v3/{v}-dark.png').convert('RGBA')
    w=1100;h=round(a.height*w/a.width);a=a.resize((w,h),Image.LANCZOS);b=b.resize((w,h),Image.LANCZOS)
    o=Image.new('RGB',(w*2+12,h),(255,0,255));o.paste(over(a,(31,58,43)),(0,0));o.paste(over(b,(31,58,43)),(w+12,0))
    o.save(S+f'logo-v3-{v}-dark-optimised-vs-plain.png')
# reference vs cutout
ref=Image.open('/workspace/asoula/assets-src/brand.jpg').crop((560,1300,3780,3120)).convert('RGB')
cut=Image.open('/workspace/asoula/brand-v3/logo-tagline.png').convert('RGBA')
w=1100;ref=ref.resize((w,round(ref.height*w/ref.width)),Image.LANCZOS)
c=cut.resize((w,round(cut.height*w/cut.width)),Image.LANCZOS)
cc=over(c,(247,242,232))
o=Image.new('RGB',(w*2+12,max(ref.height,cc.height)),(255,0,255));o.paste(ref,(0,0));o.paste(cc,(w+12,0));o.save(S+'logo-v3-side-by-side-reference.png')
# 400% zooms from the final files (nearest-neighbour)
full=Image.open('/workspace/asoula/brand-v3/logo-tagline.png').convert('RGBA')
ox,oy=177-24,108-24  # offset of crop in the crop-space; tagline variant bbox starts at min(x)=177-24? verify via bbox
