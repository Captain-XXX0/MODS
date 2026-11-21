const CATS={content:'محتوى ومغامرات',visual:'جرافيك وصوت',utility:'أدوات وتحسينات',lib:'مكتبات',mine:'أضفتها أنت'};
// [الاسم, النوع, الوصف, [متطلبات], تحقق؟]
const BASE=[
["Alex's Caves","content","كهوف ومناطق حيوية ومخلوقات واستكشاف.",["Citadel"]],
["Alex's Caves: Torpedoes","content","إضافة مرتبطة بـ Alex’s Caves.",["Alex's Caves","Citadel"],1],
["Better Cave Dweller","content","مود رعب ومطاردة داخل الكهوف.",[],1],
["Dreamshift","content","مود محتوى وتجربة جديدة.",[]],
["End of Herobrine","content","محتوى مرتبط بشخصية Herobrine.",[]],
["Faithful Backrooms","content","أجواء الـ Backrooms داخل اللعبة.",[],1],
["FallingTree","content","قطع الشجرة يُسقطها كاملة دفعة واحدة.",[]],
["Immersive Aircraft","content","طائرات ووسائل طيران قابلة للاستخدام.",["Framework"]],
["Magma Monsters","content","وحوش الحمم في العالم.",[],1],
["Refurbished Furniture","content","أثاث وديكورات للبيوت.",["SuperMartijn642's Core Lib","Mezz's Config Library"]],
["Sculk Horde","content","عدوى Sculk ومحتوى قتالي.",[]],
["Superb Warfare","content","أسلحة ومركبات وقتال.",[]],
["The Knocker","content","مود رعب بكائن مخيف.",[]],
["The Wonderland","content","عالم/محتوى Wonderland.",[],1],
["Connected Glass","visual","اتصال أشكال الزجاج ببعضها.",[]],
["Dynamic Lights","visual","إضاءة ديناميكية للأشياء في اليد.",[],1],
["Oculus","visual","دعم الشيدرز على Forge.",["Embeddium"]],
["Sound Physics Remastered","visual","ارتداد الصوت وكتمه حسب المكان.",[]],
["e4mc","utility","فتح عالمك للعب الجماعي أونلاين.",[]],
["Effortless Building","utility","أدوات لتسريع البناء.",[]],
["Entity Culling","utility","أداء أفضل بعدم رسم الكيانات المخفية.",[]],
["Jade","utility","معلومات البلوك أو الكيان الذي تنظر إليه.",[]],
["Just Enough Items","utility","عرض الوصفات وطرق التصنيع (JEI).",[]],
["Memory Leak Fix","utility","إصلاح تسرب الذاكرة.",[]],
["ModernFix","utility","أداء أعلى وتحميل أسرع وذاكرة أقل.",[]],
["Mouse Tweaks","utility","تحكم أفضل بالماوس في القوائم.",[]],
["Preloading Tricks","utility","تحسين تحميل اللعبة.",[],1],
["Searchrinth","utility","بحث Modrinth من داخل اللعبة.",[],1],
["Veinminer","utility","كسر الخامات المتصلة دفعة واحدة.",[]],
["Simple Voice Chat","utility","محادثة صوتية داخل اللعبة.",[]],
["Xaero's Minimap","utility","خريطة مصغرة على الشاشة.",[]],
["TL Skin & Cape","utility","سكنات وعباءات مخصصة.",[],1],
["Yes Steve Model","utility","نماذج وحركات شخصيات مخصصة (YSM).",[]],
["Architectury API","lib","مكتبة توافق لعدة مودات.",[]],
["Citadel","lib","مكتبة لمودات الكائنات والمحتوى.",[]],
["Cloth Config API","lib","واجهات إعدادات المودات.",[]],
["Curios API","lib","خانات إضافية للإكسسوارات.",[]],
["Framework","lib","مكتبة لمود Immersive Aircraft.",[]],
["Fusion","lib","مكتبة موارد ورسوميات.",[]],
["GeckoLib","lib","أنيميشن ونماذج متحركة.",[]],
["Kotlin for Forge","lib","دعم المودات المكتوبة بـ Kotlin.",[]],
["Mezz's Config Library","lib","مكتبة إعدادات.",[]],
["Embeddium","lib","محرك تحسين أداء الرسوميات.",[]],
["SuperMartijn642's Core Lib","lib","مكتبة أساسية لمودات SuperMartijn642.",[]]
].map(a=>({n:a[0],c:a[1],d:a[2],r:a[3],u:!!a[4]}));

let mine=[];try{mine=JSON.parse(localStorage.getItem('myMods')||'[]')}catch(e){}
const save=()=>{try{localStorage.setItem('myMods',JSON.stringify(mine))}catch(e){}};
const $=id=>document.getElementById(id);
const esc=s=>s.replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const pretty=s=>esc(s).replace(/'/g,'’');
let filter='all',visible=[],first=true;

$('chips').innerHTML=['all',...Object.keys(CATS)].map(k=>`<button class="chip${k==='all'?' on':''}" data-k="${k}" type="button">${k==='all'?'الكل':CATS[k]}</button>`).join('');
$('chips').onclick=e=>{const k=e.target.dataset.k;if(!k)return;filter=k;document.querySelectorAll('.chip').forEach(b=>b.classList.toggle('on',b.dataset.k===k));first=true;render()};

function toast(t){const e=$('toast');e.textContent=t;e.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('show'),1800)}
async function copy(t){try{await navigator.clipboard.writeText(t);return true}catch(e){try{const a=document.createElement('textarea');a.value=t;a.style.cssText='position:fixed;opacity:0';document.body.appendChild(a);a.select();const ok=document.execCommand('copy');a.remove();return ok}catch(_){return false}}}

function row(m,i,idx){
  const q=encodeURIComponent(m.n);
  const req=m.r.length?`<p class="req">يحتاج لتشغيله: <b>${m.r.map(pretty).join('، ')}</b></p>`:'';
  return `<li data-n="${esc(m.n)}" class="row${first&&idx<12?' in':''}" style="--i:${idx}">
    <span class="ico c-${m.c}" aria-hidden="true"></span>
    <div><h3 class="name">${pretty(m.n)}${m.u?'<span class="chk">تحقّق من الاسم</span>':''}</h3>
    <p class="desc">${esc(m.d||'')}</p>${req}</div>
    <div class="act">
      <button class="cp" type="button" data-cp="${esc(m.n)}">نسخ الاسم</button>
      <a target="_blank" rel="noopener noreferrer" href="https://modrinth.com/mods?q=${q}">Modrinth</a>
      <a target="_blank" rel="noopener noreferrer" href="https://www.curseforge.com/minecraft/search?class=mc-mods&search=${q}">CurseForge</a>
      ${m.c==='mine'?`<button class="del" type="button" data-del="${i}" aria-label="حذف ${esc(m.n)}">حذف</button>`:''}
    </div></li>`}

function render(){
  const s=$('q').value.trim().toLowerCase();
  const all=[...BASE,...mine.map(x=>({...x,c:'mine'}))];
  visible=all.filter(m=>(filter==='all'||m.c===filter)&&(m.n+m.d+m.r.join(' ')).toLowerCase().includes(s));
  let h='',idx=0;
  for(const k of Object.keys(CATS)){
    const items=visible.filter(m=>m.c===k);if(!items.length)continue;
    h+=`<h2>${CATS[k]}</h2><ul class="list">${items.map(m=>row(m,m.c==='mine'?mine.findIndex(x=>x.n===m.n):0,idx++)).join('')}</ul>`}
  $('out').innerHTML=h||'<div class="empty">لا توجد نتائج. جرّب اسمًا آخر أو أضفه من الأعلى.</div>';
  $('count').textContent=`${visible.length} من ${all.length} مود`;
  first=false;
}
$('out').onclick=async e=>{
  const cp=e.target.closest('[data-cp]');
  if(cp){
    if(await copy(cp.dataset.cp)){
      toast('تم نسخ: '+cp.dataset.cp.replace(/'/g,'’'));
      cp.textContent='تم النسخ';cp.classList.add('done');
      setTimeout(()=>{cp.textContent='نسخ الاسم';cp.classList.remove('done')},1500);
    }else toast('تعذّر النسخ');
    return}
  const d=e.target.closest('[data-del]');
  if(d){const li=d.closest('.row');li.classList.remove('in');li.classList.add('out');
    setTimeout(()=>{mine.splice(+d.dataset.del,1);save();render();toast('تم الحذف')},300)}
};
$('copyAll').onclick=async()=>{if(!visible.length)return toast('لا توجد أسماء');if(await copy(visible.map(m=>m.n).join('\n')))toast(`تم نسخ ${visible.length} اسم`)};
$('q').oninput=render;
function add(){
  const n=$('newName').value.trim();if(!n)return $('newName').focus();
  if([...BASE,...mine].some(m=>m.n.toLowerCase()===n.toLowerCase()))return toast('المود موجود بالفعل');
  const r=$('newReq').value.split(/[,،]/).map(x=>x.trim()).filter(Boolean);
  mine.push({n,d:'مود مضاف يدويًا.',r,u:false});save();
  $('newName').value='';$('newReq').value='';filter='all';$('q').value='';
  document.querySelectorAll('.chip').forEach(b=>b.classList.toggle('on',b.dataset.k==='all'));
  first=false;render();toast('تمت إضافة: '+n.replace(/'/g,'’'));
  const last=document.querySelector('.list:last-of-type .row:last-child');
  if(last){last.classList.add('in');last.scrollIntoView({behavior:'smooth',block:'center'})}
}
$('addBtn').onclick=add;
['newName','newReq'].forEach(id=>$(id).addEventListener('keydown',e=>{if(e.key==='Enter')add()}));
render();

// أيقونات المودات من Modrinth (تعمل لما الصفحة تتفتح من جهازك أو موقع عادي)
const ICONS={};try{Object.assign(ICONS,JSON.parse(localStorage.getItem('icons')||'{}'))}catch(e){}
const PEND={};
const norm=s=>s.toLowerCase().replace(/[^a-z0-9]/g,'');
function getIcon(n){
  if(n in ICONS)return Promise.resolve(ICONS[n]);
  return PEND[n]||(PEND[n]=fetch('https://api.modrinth.com/v2/search?limit=5&facets='+encodeURIComponent('[["project_type:mod"]]')+'&query='+encodeURIComponent(n))
    .then(r=>r.json()).then(j=>{
      const h=j.hits.find(x=>norm(x.title)===norm(n))||j.hits[0];
      ICONS[n]=(h&&h.icon_url)||'';
      try{localStorage.setItem('icons',JSON.stringify(ICONS))}catch(e){}
      return ICONS[n]}).catch(()=>'').finally(()=>{delete PEND[n]}));
}
function hydrate(){
  const rows=[...document.querySelectorAll('.row[data-n]')];let i=0;
  const worker=async()=>{while(i<rows.length){
    const r=rows[i++];const u=await getIcon(r.dataset.n);
    if(u&&r.isConnected&&!r.querySelector('.ico img')){
      const im=new Image();im.alt='';im.referrerPolicy='no-referrer';
      im.onload=()=>{r.querySelector('.ico').appendChild(im);requestAnimationFrame(()=>im.classList.add('ok'))};
      im.src=u}}};
  for(let k=0;k<4;k++)worker();
}
const _render=render;render=function(){_render();hydrate()};
render();

/* خلفيات تتغير مع السكرول + لون الأزرار يتغير مع كل خلفية */
(function(){
  var bgs=[].slice.call(document.querySelectorAll('.bgs .bg'));
  if(bgs.length<2)return;
  var root=document.documentElement;
  var FALLBACK=[100,205,28,275];           /* ألوان احتياطية لو تعذّر قراءة الصورة */
  var hues=FALLBACK.slice();
  function url(b,v){var m=new RegExp(v+':url\\([\"\']?([^\"\')]+)').exec(b.getAttribute('style')||'');return m&&m[1];}
  function hueOf(img){
    try{
      var c=document.createElement('canvas');c.width=c.height=24;
      var x=c.getContext('2d');x.drawImage(img,0,0,24,24);
      var d=x.getImageData(0,0,24,24).data,sx=0,sy=0,w=0;
      for(var i=0;i<d.length;i+=4){
        var r=d[i]/255,g=d[i+1]/255,b=d[i+2]/255,mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2,df=mx-mn;
        if(df<.12||l<.12||l>.92)continue;
        var s=df/(1-Math.abs(2*l-1)),h;
        if(mx===r)h=((g-b)/df)%6;else if(mx===g)h=(b-r)/df+2;else h=(r-g)/df+4;
        h*=60;if(h<0)h+=360;
        var wt=s*df;sx+=Math.cos(h*Math.PI/180)*wt;sy+=Math.sin(h*Math.PI/180)*wt;w+=wt;
      }
      if(w>0){var a=Math.atan2(sy,sx)*180/Math.PI;return Math.round((a+360)%360);}
    }catch(e){}
    return null;
  }
  bgs.forEach(function(b,k){
    [url(b,'--local'),url(b,'--img')].forEach(function(u,t){
      if(!u)return;var im=new Image();
      if(t===1)im.crossOrigin='anonymous';
      im.onload=function(){
        if(t===0)b.classList.add('hq');          /* صورة HQ محلية موجودة: شيل التغبيش */
        var h=hueOf(im);if(h!=null&&(t===0||!b.classList.contains('hq'))){hues[k]=h;if(k===cur)apply();}
      };
      im.src=u;
    });
  });
  var cur=0,tick=false;
  function apply(){root.style.setProperty('--h',hues[cur]);}
  function update(){
    tick=false;
    var max=root.scrollHeight-window.innerHeight;
    var p=max>0?Math.min(1,Math.max(0,window.scrollY/max)):0;
    var i=Math.min(bgs.length-1,Math.floor(p*bgs.length));
    if(i!==cur){bgs[cur].classList.remove('on');bgs[i].classList.add('on');cur=i;apply();}
  }
  function req(){if(!tick){tick=true;requestAnimationFrame(update);}}
  addEventListener('scroll',req,{passive:true});
  addEventListener('resize',req);
  new MutationObserver(req).observe(document.getElementById('out')||document.body,{childList:true,subtree:true});
  apply();update();
})();

/* مكعبات صغيرة تتطاير عند نسخ اسم مود */
document.addEventListener('click',function(e){
  var b=e.target.closest&&e.target.closest('.cp');if(!b)return;
  if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  var r=b.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
  for(var i=0;i<10;i++){
    var p=document.createElement('i');p.className='px';
    var a=Math.random()*Math.PI*2,d=40+Math.random()*50;
    p.style.cssText='left:'+cx+'px;top:'+cy+'px;background:hsl('+(Math.random()*40-20)+'deg 0% 0%);'
      +'background:hsl(calc(var(--h) * 1deg + '+Math.round(Math.random()*40-20)+'deg) 75% '+(50+Math.round(Math.random()*20))+'%);'
      +'--dx:'+Math.cos(a)*d+'px;--dy:'+Math.sin(a)*d+'px;--r:'+Math.round(Math.random()*360)+'deg';
    document.body.appendChild(p);setTimeout(function(q){q.remove()}.bind(null,p),750);
  }
});
