import { t } from '../i18n.js';
import { getDaily } from '../daily-picks.js';

function pickHeroImage(){
  const c=['/decorative-images/paradise-beach.webp','/decorative-images/paradise-beach.jpg','/decorative-images/paradise-beach.png'];
  return new Promise((resolve)=>{let i=0;const probe=new Image();const next=()=>{if(i>=c.length){resolve(null);return}probe.onload=()=>resolve(c[i]);probe.onerror=()=>{i++;next()};probe.src=c[i]};next()});
}

export async function initHome(){
  const root=document.getElementById('app');
  root.innerHTML = `
    <section class="hero" id="hero">
      <img class="hero-bg" id="heroImg" alt="">
      <div class="hero-overlay"></div>
      <div class="hero-title use-ibiza-font">IbizaGirl.pics</div>
      <div class="hero-sub">Exclusive mediterranean vibes</div>
    </section>
    <div id="menuMount"></div>
    <h2 style="padding:10px 12px">${t('home')}</h2>
    <section class="carousel"><div class="carousel-track" id="homeCarousel"></div></section>
    <section class="grid" id="homeGrid"></section>
  `;

  const heroSrc = await pickHeroImage();
  const heroImg = document.getElementById('heroImg');
  if(heroSrc){ heroImg.src = heroSrc; } else {
    try{ const {home20}=getDaily(); const f=home20[0]; const u=f?.banner||f?.cover||f?.thumb||f?.src||f?.file||f?.url||f?.path; if(u) heroImg.src=u;}catch(_){}
  }

  const {home20}=getDaily();
  const car=document.getElementById('homeCarousel');
  home20.forEach(it=>{ const u=it.banner||it.cover||it.thumb||it.src||it.file||it.url||it.path; const s=document.createElement('div'); s.className='slide'; s.innerHTML=`<img src="${u}" alt="">`; car.appendChild(s); });

  const grid=document.getElementById('homeGrid');
  home20.forEach((it,i)=>{ const id=it.id||it.file||`full-${i}`; const u=it.thumb||it.src||it.file||it.url||it.path; const c=document.createElement('div'); c.className='card'; c.dataset.id=id; c.innerHTML=`<img loading="lazy" src="${u}" alt="">`; grid.appendChild(c); });
}
