const P=require('/tmp/pp/node_modules/puppeteer-core'),fs=require('fs'),path=require('path');
// node render.js in.svg|png out.png cssWidth bg [dpr]   (renders the file as <img> from a data URL)
(async()=>{const [,,inp,out,wd,bg,dpr]=process.argv;const ext=path.extname(inp).slice(1);const mime=ext=='svg'?'image/svg+xml':'image/'+ext;
const url='data:'+mime+';base64,'+fs.readFileSync(inp).toString('base64');
const b=await P.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const p=await b.newPage();
await p.setViewport({width:+wd,height:400,deviceScaleFactor:+(dpr||1)});
await p.setContent(`<body style="margin:0;background:${bg}"><img id=i src="${url}" style="width:${wd}px;display:block"></body>`);
await p.waitForFunction(()=>document.getElementById('i').complete&&document.getElementById('i').naturalWidth>0);const el=await p.$('#i');await el.screenshot({path:out});await b.close()})();
