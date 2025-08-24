import { t } from '../i18n.js';
import { getDaily } from '../daily-picks.js';

function pickBannerFromPool(){
  try{
    const U = window.UnifiedContentAPI;
    if(U?.getPublicImages){
      const all=U.getPublicImages();
      const b=all.filter(x=>x.isBanner||/banner/i.test(x?.tag||'')||/banner/i.test(x?.type||'')); 
      return (b.length?b[Math.floor(Math.random()*b.length)]:all[0])||null;
    }
  }catch(_){}
  return null;
}

export async function initHome(){
  const root=document.getElementById('app');
  root.innerHTML=`
    <section class="hero" id="hero" style="background-image:url('/decorative-images/cover.png');background-size:cover;background-position:center;">
      <img class="hero-bg" id="heroImg" alt="">
      <div class="hero-overlay"></div>
      <div class="hero-title" style="font-family:'Sexy Beachy',system-ui">IbizaGirl.pics</div>
      <div class="hero-sub">${t('welcome')}</div>
    </section>
    <h2 style="padding:10px 12px">${t('home')}</h2>
    <section class="carousel"><div class="carousel-track" id="homeCarousel"></div></section>
    <section class="grid" id="homeGrid"></section>`;

  const b=pickBannerFromPool();
  const url=b?.banner||b?.cover||b?.thumb||b?.src||b?.file||b?.url||b?.path;
  if(url){ const img=document.getElementById('heroImg'); img.src=url; img.style.width='100%'; img.style.height='44vh'; img.style.objectFit='cover'; }

  const {home20}=getDaily();
  const car=document.getElementById('homeCarousel');
  home20.forEach(it=>{
    const u=it.banner||it.cover||it.thumb||it.src||it.file||it.url||it.path;
    const s=document.createElement('div'); s.className='slide'; s.innerHTML=`<img src="${u}" alt="">`; car.appendChild(s);
  });

  const grid=document.getElementById('homeGrid');
  home20.forEach((it,i)=>{
    const id=it.id||it.file||`full-${i}`;
    const u=it.thumb||it.src||it.file||it.url||it.path;
    const c=document.createElement('div'); c.className='card'; c.dataset.id=id; c.innerHTML=`<img loading="lazy" src="${u}" alt="">`;
    grid.appendChild(c);
  });
}
