import sys,numpy as np
from PIL import Image
def over(rgba,bg):
    im=Image.fromarray(rgba,'RGBA') if isinstance(rgba,np.ndarray) else rgba
    o=Image.new('RGBA',im.size,bg+(255,));o.alpha_composite(im);return o.convert('RGB')
if __name__=='__main__':
    r=np.load('/tmp/rgba.npy')
    for n,bg in (('dark',(31,58,43)),('cream',(247,242,232)),('white',(255,255,255))):
        o=over(r,bg);o.thumbnail((1600,1600));o.save(f'/tmp/m_{n}.png')
