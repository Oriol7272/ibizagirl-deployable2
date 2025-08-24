import { t } from '../i18n.js';
import { getDaily } from '../daily-picks.js';
import { imgUrl } from '../utils.js';

function pickBannerFromPool(){
  try{
    const U=window.UnifiedContentAPI;
    if(U?.getPublicImages){
      const all=U.getPublicImages();
      const banners=all.filter(x=>x.isBanner||/banner/i.test(x?.tag||'')||/banner/i.test(x?.type||''));
      return (banners.length?banners[Math.floor(Math.random()*banners.length)]:all[0])||null;
    }
  }catch(_){}
  return null;
}

export async function initHome(){
  const root=document.getElementById('app');
  root.innerHTML=`
    <section class="hero" id="hero">
      <img class="hero-bg" id="heroImg" src="/decorative-images/paradise-beach.png" alt="">
      <div class="hero-overlay"></div>
      <div class="hero-title">ibizagirl.pics</div>
      <div class="hero-sub">${t('welcome')}</div>
    </section>
    <h2 style="padding:10px 12px">${t('home')}</h2>
    <section class="carousel"><div class="carousel-track" id="homeCarousel"></div></section>
    <section class="grid" id="homeGrid"></section>`;

  // banner real del pool si existe
  const b=pickBannerFromPool(); const url = b && imgUrl(b); if(url){ document.getElementById('heroImg').src=url; }

  const {home20}=getDaily();

  // carrusel
  const car=document.getElementById('homeCarousel');
  home20.forEach(it=>{ const u=imgUrl(it); const s=document.createElement('div'); s.className='slide'; s.innerHTML=`<img src="${u}" alt="">`; car.appendChild(s); });

  // grid
  const grid=document.getElementById('homeGrid');
  home20.forEach((it,i)=>{ const id=it.id||it.file||`full-${i}`; const u=imgUrl(it);
    const c=document.createElement('div'); c.className='card'; c.dataset.id=id; c.innerHTML=`<img loading="lazy" src="${u}" alt="">`;
    grid.appendChild(c);
  });
}
