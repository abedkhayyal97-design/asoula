import sys,numpy as np
from PIL import Image,ImageDraw
from comp import over
r=np.load('/tmp/rgba.npy');ref=Image.fromarray(np.load('/tmp/crop.npy'))
def sheet(name,box,z=4,bgs=((247,242,232),(31,58,43),(255,255,255))):
    x0,y0,x1,y1=box;tiles=[ref.crop(box)]+[over(Image.fromarray(r[y0:y1,x0:x1],'RGBA'),b) for b in bgs]
    tiles=[t.resize((t.width*z,t.height*z),Image.NEAREST) for t in tiles]
    w,h=tiles[0].size;o=Image.new('RGB',(w*2+10,h*2+10),(255,0,255))
    for i,t in enumerate(tiles):o.paste(t,((i%2)*(w+10),(i//2)*(h+10)))
    o.save(f'/tmp/zoom_{name}.png');print(name,o.size)
if __name__=='__main__':
    sheet('ainhead',(2330,550,2560,700))      # ع head hook edge
    sheet('bee',(1450,100,1720,330),3)
    sheet('drop',(480,1100,760,1420),3)
    sheet('lam',(250,200,520,420),3)
    sheet('waw',(1250,700,1520,900),3)
    sheet('mtn',(1180,1280,1620,1500),2)
    sheet('tag',(1180,1500,1700,1790),2)
    sheet('leaf',(2780,720,3140,1010),3)
    sheet('dash',(1700,60,2120,360),3)
