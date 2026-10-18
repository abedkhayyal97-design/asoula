(()=>{const b=document.getElementById("mb"),n=document.getElementById("nv");if(!b||!n)return;
const set=o=>{b.setAttribute("aria-expanded",o);n.classList.toggle("open",o)};
b.addEventListener("click",()=>set(b.getAttribute("aria-expanded")!=="true"));
n.addEventListener("click",e=>{if(e.target.closest("a"))set(false)});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&b.getAttribute("aria-expanded")==="true"){set(false);b.focus()}});
document.addEventListener("click",e=>{if(!e.target.closest(".hd"))set(false)});
matchMedia("(min-width:900px)").addEventListener("change",()=>set(false))})();
