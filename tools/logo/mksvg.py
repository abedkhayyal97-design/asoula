import json,sys,colorsys
res=json.load(open(sys.argv[1]))
def lift(c,t=None):  # dark-background variant: mix toward warm cream (keeps hue, raises lightness)
    k=.4;r,g,b=[c[0]+(255-c[0])*k,c[1]+(204-c[1])*k,c[2]+(72-c[2])*k];return '#%02x%02x%02x'%(round(r),round(g),round(b))
def svg(name,variant,title):
    d=res[name];x,y,w,h=d['box'];L=d['layers'];C=d['cols']
    cols=[ '#%02x%02x%02x'%tuple(c) if variant=='true' else lift(c) for c in C]
    # light-on-dark variant lifts lightness additively so the darkest browns stay readable
    body=''.join(f'<path fill="{cols[i]}" d="{L[i]}"/>' for i in range(len(L)))
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x} {y} {w} {h}" role="img" aria-label="{title}"><title>{title}</title>{body}</svg>'
T='عسولة – عسل جبلي'
for n in ['full','compact','bee']:
    for v in ['true','light']:
        open(f'{sys.argv[2]}-{n}-{v}.svg','w',encoding='utf8').write(svg(n,v,T))
