import { t } from '../i18n.js';
import { getDaily } from '../daily-picks.js';

function pickBannerFromPool(){
  try{
    const U = window.UnifiedContentAPI;
    if (U && U.getPublicImages) {
      const all = U.getPublicImages();
      const banners = all.filter(x => x.isBanner || /banner/i.test(x?.tag||'') || /banner/i.test(x?.type||''));
      if (banners.length) return banners[Math.floor(Math.random()*banners.length)];
      return all[0] || null;
    }
  }catch(_){}
  return null;
}

export async function initHome(){
  const root=document.getElementById('app');
  root.innerHTML = `
    <section class="hero" id="hero">
      <img class="hero-bg" id="heroImg" alt="">
      <div class="hero-overlay"></div>
      <div class="hero-title">IbizaGirl.pics</div>
      <div class="hero-sub">Exclusive mediterranean vibes</div>
    </section>
    <div id="menuMount"></div>
    <h2 style="padding:10px 12px">${t('home')}</h2>
    <section class="carousel"><div class="carousel-track" id="homeCarousel"></div></section>
    <section class="grid" id="homeGrid"></section>
  `;

  // Banner sin 404: usa contenido real
  const b = pickBannerFromPool();
  const heroImg = document.getElementById('heroImg');
  const bUrl = b?.banner || b?.cover || b?.thumb || b?.src || b?.file || b?.url || b?.path;
  if (bUrl) heroImg.src = bUrl;

  // Carrusel + 20 imágenes de /full
  const {home20} = getDaily();
  const car=document.getElementById('homeCarousel');
  home20.forEach(it=>{
    const u=it.banner||it.cover||it.thumb||it.src||it.file||it.url||it.path;
    const s=document.createElement('div'); s.className='slide'; s.innerHTML=`<img src="${u}" alt="">`; car.appendChild(s);
  });
  const grid=document.getElementById('homeGrid');
  home20.forEach((it,i)=>{
    const id=it.id||it.file||`full-${i}`; const u=it.thumb||it.src||it.file||it.url||it.path;
    const c=document.createElement('div'); c.className='card'; c.dataset.id=id; c.innerHTML=`<img loading="lazy" src="${u}" alt="">`; grid.appendChild(c);
  });
}
