// HTML generators for the master-plan additions (header nav, cards, sections, product pages, privacy). Pure functions of data/*.json.
export const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const ICON={
 layers:'<path d="M12 3 3 8l9 5 9-5-9-5Z"/><path d="m3 13 9 5 9-5"/>',
 leaf:'<path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14"/><path d="M5 19c2-5 5-8 9-10"/>',
 calendar:'<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M8 3v4M16 3v4M3.5 10h17"/>',
 chat:'<path d="M4 5h16v11H9l-5 4V5Z"/><path d="M8 9.5h8M8 12.5h5"/>',
 pin:'<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.4"/>',
 wa:'<path d="M4 20l1.4-4.2A8 8 0 1 1 8.3 18.7L4 20Z"/><path d="M9 9.2c.3 2.6 2.4 4.8 5.6 5.6l1.2-1.4-2-1-.9.8c-.9-.4-1.7-1.2-2.1-2.1l.8-.9-1-2L9 9.2Z"/>'
};
export const icon=(n,c="ic")=>`<svg class="${c}" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICON[n]}</svg>`;
export const waLink=(S,text)=>"https://wa.me/"+S.whatsapp+"?text="+encodeURIComponent(text);
export const askMsg=x=>"مرحباً عسولة، أريد الاستفسار عن: "+x;
// Message used for orders from product pages (also rebuilt client-side with weight/qty by src/product.js)
export const orderMsg=(name,weight,qty)=>"مرحباً عسولة، أرغب بطلب المنتج التالي:\nاسم المنتج: "+name+(weight?"\nالوزن: "+weight:"")+"\nالكمية: "+qty+"\nأرجو تأكيد السعر النهائي وتكلفة التوصيل.";
const hn=p=>"عسل "+p.name;
export const photoImg=(ph,cls,lazy=true)=>ph&&ph.src?`<img class="${cls}" src="__BASE__${esc(ph.src)}" width="${+ph.width}" height="${+ph.height}" alt="${esc(ph.alt||"")}"${lazy?' loading="lazy"':""} decoding="async">`:"";

export function header(S,base,home){
 const hrefs=[home?"#top":(base||"./"),base+"#products",base+"#story",base+"#faq"];
 const nav=S.nav.map((n,i)=>`<a href="${hrefs[i]}">${esc(n[0])}</a>`).join("");
 return `<header class="hd"><div class="w hi">
 <a class="bd" href="${home?"#top":base||"./"}">LOGO</a>
 <nav class="nv" id="nv" aria-label="التنقل الرئيسي">${nav}<a class="btn sm nvb" href="${base}#products">اكتشف المنتجات</a></nav>
 <div class="ha"><a class="btn sm" href="${waLink(S,askMsg("استفسار عام"))}" target="_blank" rel="noopener"><span>اطلب <span class="hm">عبر </span>واتساب</span></a>
 <button class="mb" id="mb" type="button" aria-expanded="false" aria-controls="nv" aria-label="القائمة"><span></span><span></span><span></span></button></div>
</div></header>`}

export function footer(S,P,base,home){
 const f=S.footer||{},soc=Object.entries(f.social||{}).filter(([k,v])=>!k.startsWith("_")&&v&&/^https?:\/\//.test(v));
 const SN={instagram:"إنستغرام",facebook:"فيسبوك",tiktok:"تيك توك",youtube:"يوتيوب"};
 return `<footer><div class="w">
 <div class="fg">
  <div class="fc1"><span class="bd">FLOGO</span><p>${esc(f.about)}</p></div>
  <nav class="fc2" aria-label="روابط الموقع"><p class="fh">الموقع</p><ul>${S.nav.map((n,i)=>`<li><a href="${[home?"#top":(base||"./"),base+"#products",base+"#story",base+"#faq"][i]}">${esc(n[0])}</a></li>`).join("")}<li><a href="${base}privacy/">سياسة الخصوصية</a></li></ul></nav>
  <nav class="fc3" aria-label="أنواع العسل"><p class="fh">أنواع العسل</p><ul>${P.map(p=>`<li><a href="${base}honey/${p.slug}/">${esc(hn(p))}</a></li>`).join("")}</ul></nav>
  <div class="fc4"><p class="fh">تواصل معنا</p><ul><li><a class="fwa" href="${waLink(S,askMsg("استفسار عام"))}" target="_blank" rel="noopener">${icon("wa","ic fic")}<span>واتساب <bdi class="ph">${esc(S.phoneDisplay)}</bdi></span></a></li>${soc.map(([k,v])=>`<li><a href="${esc(v)}" target="_blank" rel="noopener me">${esc(SN[k]||k)}</a></li>`).join("")}${f.delivery?`<li class="fdl">${esc(f.delivery)}</li>`:""}</ul></div>
 </div>
 <div class="fb2"><span>© <span id="yr"></span> عسولة · <button class="fb" id="cb" type="button">جميع الحقوق محفوظة</button></span><a href="${base}privacy/">سياسة الخصوصية</a></div>
</div></footer>`}
export const dialog=S=>`<dialog id="cr"><p class="bd" style="justify-content:center;font-size:1.6rem">© عسولة</p><p>جميع الحقوق محفوظة لـ <b>${esc(S.copyrightHolder)}</b></p><form method="dialog"><button class="btn sm">إغلاق</button></form></dialog>`;

// ---------- product price / meta helpers ----------
const priceText=p=>p.price?esc(p.price):"السعر عند الطلب";
const avail=p=>p.availability?`<span class="av">${esc(p.availability)}</span>`:"";

export function productCards(S,P,JAR,base){
 return `<ul class="pg" aria-label="أنواع العسل">${P.map(p=>`<li><article class="pc" style="--c:${p.color}">
  <svg class="jar" viewBox="0 0 200 260" aria-hidden="true">${JAR}</svg>
  <h3><a href="${base}honey/${p.slug}/">${esc(hn(p))}</a></h3>
  <p class="mu pd">${esc(p.desc)}</p>
  <div class="ch"><b>${esc(p.taste)}</b><b>القطاف: ${esc(p.season)}</b></div>
  <p class="pp2"><span class="pr">${priceText(p)}</span>${p.weights&&p.weights.length?` <span class="wl">${p.weights.map(w=>esc(w.label)).join(" · ")}</span>`:""} ${avail(p)}</p>
  <div class="pa"><a class="btn sm ol" href="${base}honey/${p.slug}/" aria-label="اكتشف ${esc(hn(p))}">اكتشف المنتج</a><a class="btn sm" href="${waLink(S,orderMsg(hn(p),"",1))}" target="_blank" rel="noopener" aria-label="اطلب ${esc(hn(p))} عبر واتساب">اطلب عبر واتساب</a></div>
 </article></li>`).join("")}</ul>`}

export function whySection(S){const W=S.why;return `<section class="sec alt" id="why"><div class="w">
 <span class="k">${esc(W.kicker)}</span><h2>${esc(W.title)}</h2><p class="mu" style="margin:0">${esc(W.text)}</p>
 <ul class="wy">${W.points.map(x=>`<li>${icon(x.icon)}<h3>${esc(x.title)}</h3><p class="mu">${esc(x.text)}</p></li>`).join("")}</ul>
</div></section>`}

export function storySection(S,JAR){const T=S.story,V=S.values;
 const ph=T.photo&&T.photo.src?`<figure class="sp">${photoImg(T.photo,"spi")}</figure>`:`<figure class="sp ph0" aria-hidden="true"><svg class="jar" viewBox="0 0 200 260" style="--c:#E0A93B">${JAR}</svg></figure>`;
 const org=T.origin&&T.origin.text?`<p>${esc(T.origin.text)}</p>`:`<p class="mu">${esc(T.originPlaceholder)}</p>`;
 return `<section class="sec" id="story"><div class="w">
 <span class="k">${esc(T.kicker)}</span><h2>${esc(T.title)}</h2>
 <div class="sg"><div>
  <h3 class="sh">${esc(V.title)}</h3><p class="mu" style="margin:0">${esc(V.text)}</p>
  <ul class="pts">${V.points.map(x=>`<li class="pt"><b>${esc(x.title)}</b> <small>— ${esc(x.text)}</small></li>`).join("")}</ul>
  <div class="og"><h3>${esc(T.origin.title)}</h3>${org}<a class="btn sm ol" href="${waLink(S,askMsg("مصدر العسل"))}" target="_blank" rel="noopener">اسألنا عن المصدر</a></div>
 </div>${ph}</div>
 <!--FW:story-->
</div></section>`}

export function compareSection(S,P){const C=S.compare;
 return `<section class="sec alt" id="compare"><div class="w">
 <span class="k">${esc(C.kicker)}</span><h2>${esc(C.title)}</h2><p class="mu" style="margin:0">${esc(C.text)}</p>
 <table class="cmp"><caption class="sr">مقارنة بين أنواع العسل: المصدر والطعم وموسم القطاف</caption>
 <thead><tr><th scope="col">النوع</th><th scope="col">المصدر</th><th scope="col">الطعم</th><th scope="col">موسم القطاف</th></tr></thead>
 <tbody>${P.map(p=>`<tr style="--c:${p.color}"><th scope="row"><i></i><a href="honey/${p.slug}/">${esc(hn(p))}</a></th><td data-l="المصدر">${p.source?esc(p.source):esc(p.desc.replace(/\.$/,""))}</td><td data-l="الطعم">${esc(p.taste)}</td><td data-l="موسم القطاف">${esc(p.season)}</td></tr>`).join("")}</tbody></table>
 <p class="mu" style="text-align:center;margin:18px 0 0">${esc(C.more)}</p>
</div></section>`}

export function faqSection(S){const F=S.faq;
 return `<section class="sec" id="faq"><div class="w">
 <span class="k">${esc(F.kicker)}</span><h2>${esc(F.title)}</h2>
 <div class="fq">${faqItems(S,F.items)}</div>
</div></section>`}
export function faqItems(S,items){
 return items.map(x=>{let a=x.a;if(x.key==="delivery"&&S.footer&&S.footer.delivery)a=S.footer.delivery;return `<details><summary>${esc(x.q)}</summary><div class="fa"><p>${esc(a)}</p></div></details>`}).join("")}

export function healthBox(S){const H=S.health;return `<section class="sec"><div class="w"><p class="bx">${esc(H.title)}: ${esc(H.text)} ${esc(H.readLabel)} ${H.links.map((l,i)=>(i?"و":"")+`<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join("")}.</p></div></section>`}

export function ctaSection(S,base){const C=S.cta;
 return `<section class="cta" id="contact"><span class="k" style="color:#E6CF93">${esc(C.kicker)}</span><h2>${esc(S.cta2.title)}</h2><p>${esc(C.text)}</p><div class="hb"><a class="btn" href="${waLink(S,askMsg(C.generalMessage.replace(/^استفسار عن /,"")||C.generalMessage))}" target="_blank" rel="noopener">${esc(C.button)} ↗</a><a class="btn ol" href="${base}#products">${esc(S.cta2.secondary)}</a></div><small>${esc(C.orPhone)} <span>${esc(S.phoneDisplay)}</span></small>
<!--FW:cta-->
</section>`}

// ---------- product page ----------
export function productPage(S,P,p,JAR,base){
 const others=P.filter(o=>o.slug!==p.slug);
 const ph=p.photo&&p.photo.src?photoImg(p.photo,"ppi",false).replace("loading=\"lazy\" ",""):`<svg class="jar" viewBox="0 0 200 260" role="img" aria-label="مرطبان عسل ${esc(hn(p))}" style="--c:${p.color}">${JAR}</svg>`;
 const gal=(p.gallery||[]).filter(g=>g&&g.src).map(g=>photoImg(g,"gi")).join("");
 const W=p.weights||[];
 const weights=W.length?`<fieldset class="wf"><legend>الوزن</legend><div class="wr">${W.map((w,i)=>`<label class="wc"><input type="radio" name="w" value="${esc(w.label)}" data-price="${esc(w.price||"")}"><span>${esc(w.label)}</span></label>`).join("")}</div></fieldset>`:"";
 const L=a=>`<ul>${a.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`;
 const unk=S.faq.unknown;
 const pfaq=(p.faq&&p.faq.length?p.faq:[]);
 const gen=[{q:"ما سعر "+hn(p)+"؟",a:p.price?"السعر: "+p.price+". "+"للتأكد من السعر النهائي تواصل معنا عبر واتساب.":"السعر عند الطلب. "+unk},
  {q:"ما الأوزان المتوفرة؟",a:W.length?"المتوفر: "+W.map(w=>w.label).join("، ")+". "+"للتأكد من التوفر الحالي تواصل معنا عبر واتساب.":"سيُضاف قريباً. "+unk},
  {q:"هل يوجد توصيل؟",a:(S.footer&&S.footer.delivery)||("سيُضاف قريباً. "+unk)}];
 const body=`<main id="main">
<section class="pghd"><div class="w">
 <nav class="bc" aria-label="مسار التنقل"><ol><li><a href="${base}">الرئيسية</a></li><li><a href="${base}#products">أنواع العسل</a></li><li aria-current="page">${esc(hn(p))}</li></ol></nav>
 <div class="pgd" style="--c:${p.color}">
  <div class="pgal"><div class="pgm">${ph}</div>${gal?`<div class="pgs">${gal}</div>`:""}</div>
  <div class="pin" id="po" data-wa="${S.whatsapp}" data-name="${esc(hn(p))}">
   <span class="k">عسل جبلي</span><h1>${esc(hn(p))}</h1>
   <p class="mu lead">${esc(p.desc)}</p>
   <div class="ch"><b>${esc(p.taste)}</b><b>القطاف: ${esc(p.season)}</b>${avail(p)}</div>
   <p class="pp2 big"><span class="pr" id="pr" data-base="${esc(p.price||"السعر عند الطلب")}">${priceText(p)}</span></p>
   ${weights}
   <div class="qf"><label for="qn">الكمية</label><div class="qs"><button type="button" id="qm" aria-label="إنقاص الكمية">−</button><input id="qn" type="number" inputmode="numeric" min="1" max="99" value="1"><button type="button" id="qp" aria-label="زيادة الكمية">+</button></div></div>
   <a class="btn ordb" id="ord" target="_blank" rel="noopener" href="${waLink(S,orderMsg(hn(p),"",1))}">اطلب عبر واتساب ↗</a>
   <p class="nt">سيُفتح واتساب برسالة جاهزة، ويمكنك تعديلها قبل الإرسال. السعر النهائي وتكلفة التوصيل يُؤكَّدان في المحادثة.</p>
  </div>
 </div>
</div></section>
<section class="sec alt"><div class="w">
 <h2 class="h2s">عن هذا النوع</h2>
 <div class="cols">
  <div class="col"><h3>فوائده</h3>${L(p.benefits)}</div>
  <div class="col"><h3>يفيد مَن؟</h3>${L(p.for)}</div>
  <div class="col"><h3>يساعد على الوقاية من</h3>${L(p.prevents)}</div>
 </div>
 <p class="nt">معلومات تقليدية عامة وليست علاجاً أو بديلاً عن الطبيب.</p>
 <dl class="sp2">
  <div><dt>المصدر</dt><dd>${p.source?esc(p.source):esc(p.desc)}</dd></div>
  <div><dt>موسم القطاف</dt><dd>${esc(p.season)}</dd></div>
  <div><dt>الطعم</dt><dd>${esc(p.taste)}</dd></div>
  <div><dt>المنطقة / المنحل</dt><dd>${p.origin?esc(p.origin):"سيُضاف قريباً. "+esc(unk)}</dd></div>
  <div><dt>طريقة الحفظ</dt><dd>${p.storage?esc(p.storage):"سيُضاف قريباً. "+esc(unk)}</dd></div>
 </dl>
</div></section>
<section class="sec"><div class="w">
 <h2 class="h2s">أسئلة عن ${esc(hn(p))}</h2>
 <div class="fq">${faqItems(S,[...pfaq,...gen])}</div>
</div></section>
<section class="sec alt"><div class="w">
 <h2 class="h2s">اكتشف أنواعاً أخرى</h2>
 <ul class="ot">${others.map(o=>`<li style="--c:${o.color}"><a href="${base}honey/${o.slug}/"><i></i><span><b>${esc(hn(o))}</b><small>${esc(o.taste)}</small></span></a></li>`).join("")}</ul>
</div></section>
</main>`;
 return body}

export function privacyPage(S){
 return `<main id="main"><section class="pghd"><div class="w prv">
 <nav class="bc" aria-label="مسار التنقل"><ol><li><a href="../">الرئيسية</a></li><li aria-current="page">سياسة الخصوصية</li></ol></nav>
 <h1>سياسة الخصوصية</h1>
 <p class="mu">آخر تحديث: ${esc(S.privacy.updated)}</p>
 <h2 class="h2s">باختصار</h2>
 <p>هذا الموقع لا يجمع أي بيانات شخصية عنك.</p>
 <ul class="pl">
  <li>لا توجد في الموقع نماذج تسجيل أو حسابات أو تعليقات.</li>
  <li>لا يستخدم الموقع أدوات تحليلات أو إعلانات أو بكسلات تتبّع، ولا يخزّن ملفات تعريف ارتباط (كوكيز) أو بيانات في متصفحك.</li>
  <li>الخطوط والصور تُحمَّل من الموقع نفسه، دون خدمات خارجية.</li>
 </ul>
 <h2 class="h2s">الطلب عبر واتساب</h2>
 <p>تتم الطلبات والاستفسارات عبر واتساب فقط. عند الضغط على زر الطلب يُفتح تطبيق واتساب على جهازك برسالة جاهزة تستطيع تعديلها أو عدم إرسالها. ما ترسله يصل إلينا عبر واتساب ويخضع لسياسة الخصوصية الخاصة بواتساب.</p>
 <h2 class="h2s">الاستضافة</h2>
 <p>الموقع مستضاف على GitHub Pages، وقد تسجّل خدمة الاستضافة بيانات تقنية قياسية (مثل عنوان IP) بحسب سياسة مزوّد الاستضافة.</p>
 <h2 class="h2s">روابط خارجية</h2>
 <p>يحتوي الموقع على روابط لمراجع علمية خارجية (مثل PubMed وNCCIH). هذه المواقع مستقلة عنا ولها سياساتها الخاصة.</p>
 <h2 class="h2s">تواصل معنا</h2>
 <p>لأي سؤال حول الخصوصية راسلنا عبر واتساب على <bdi class="ph">${esc(S.phoneDisplay)}</bdi>.</p>
 <p><a class="btn" href="${waLink(S,askMsg("الخصوصية"))}" target="_blank" rel="noopener">تواصل عبر واتساب ↗</a></p>
</div></section></main>`}
