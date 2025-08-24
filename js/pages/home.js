import { t } from '../i18n.js';
import { getDaily } from '../daily-picks.js';

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

function fallbackImages(n){
  const pool=[
    '/decorative-images/paradise-beach.png',
    '/decorative-images/cover.png',
    '/decorative-images/49830c0a-2fd8-439c-a583-029a0b39c4d6.jpg',
    '/decorative-images/4bfb7a8b-b81e-49d7-a160-90b834d0b751.jpg',
    '/decorative-images/81f55f4d-b0df-49f4-9020-cbb0f5042c08.jpg',
    '/decorative-images/1618cbb2-8dd1-4127-99d9-d9f30536de72.jpg',
    '/decorative-images/115ae97d-909f-4760-a3a1-037a05ad9931.jpg',
    '/decorative-images/f062cb22-c99b-4dfa-9a79-572e98c6e75e.jpg'
  ];
  const out=[]; for(let i=0;i<n;i++) out.push({file: pool[i%pool.length]}); return out;
}

export async function initHome(){
  const root=document.getElementById('app');
  root.innerHTML=`
    <section class="hero" id="hero">
      <img class="hero-bg" id="heroImg" alt="">
      <div class="hero-overlay"></div>
      <div class="hero-title">IbizaGirl.pics</div>
      <div class="hero-sub">${t('welcome')}</div>
    </section>
    <h2 style="padding:10px 12px">${t('home')}</h2>
    <section class="carousel"><div class="carousel-track" id="homeCarousel"></div></section>
    <section class="grid" id="homeGrid"></section>`;

  // banner real si existe, si no el de fondo decorativo ya hace el trabajo
  const b=pickBannerFromPool();
  const bUrl=b?.banner||b?.cover||b?.thumb||b?.src||b?.file||b?.url||b?.path;
  if(bUrl){ document.getElementById('heroImg').src=bUrl; }

  // dataset
  let {home20}=getDaily();
  if(!home20 || !home20.length){ home20 = fallbackImages(20); }

  // carrusel
  const car=document.getElementById('homeCarousel');
  home20.forEach(it=>{
    const u=it.banner||it.cover||it.thumb||it.src||it.file||it.url||it.path;
    const s=document.createElement('div'); s.className='slide'; s.innerHTML=`<img src="${u}" alt="">`; car.appendChild(s);
  });

  // grid
  const grid=document.getElementById('homeGrid');
  home20.forEach((it,i)=>{
    const id=it.id||it.file||`full-${i}`;
    const u=it.thumb||it.src||it.file||it.url||it.path;
    const c=document.createElement('div'); c.className='card'; c.dataset.id=id;
    c.innerHTML=`<img loading="lazy" src="${u}" alt="">`;
    grid.appendChild(c);
  });
}
