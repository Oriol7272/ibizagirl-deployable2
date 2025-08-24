import { seededPick, imgURL } from '../utils-home.js';

/* decoratives para el BANNER (solo banner) */
const DECOS = [
  '/decorative-images/paradise-beach.png',
  '/decorative-images/49830c0a-2fd8-439c-a583-029a0b39c4d6.jpg',
  '/decorative-images/4bfb7a8b-b81e-49d7-a160-90b834d0b751.jpg',
  '/decorative-images/81f55f4d-b0df-49f4-9020-cbb0f5042c08.jpg',
  '/decorative-images/1618cbb2-8dd1-4127-99d9-d9f30536de72.jpg',
  '/decorative-images/115ae97d-909f-4760-a3a1-037a05ad9931.jpg',
  '/decorative-images/f062cb22-c99b-4dfa-9a79-572e98c6e75e.jpg'
];

function pickPublicPool(){
  const U = window.UnifiedContentAPI || {};
  let full = [];
  try{ full = (U.getPublicImages && U.getPublicImages()) || []; }catch(_){}
  if(!full || !full.length){
    try{ full = (window.ContentData2 && window.ContentData2.publicImages) || []; }catch(_){}
  }
  return full;
}

function setHeroImage(url){
  const hero = document.getElementById('hero');
  const img = document.getElementById('heroImg');
  img.onload = ()=>{ 
    const vert = img.naturalHeight > img.naturalWidth;
    hero.classList.toggle('vertical', !!vert);
  };
  img.src = url;
}

export async function initHome(){
  const root=document.getElementById('app');
  root.innerHTML=`
    <section class="hero" id="hero">
      <img class="hero-bg" id="heroImg" alt="">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="hero-panel">
          <div class="hero-title">Ibizagirl.pics</div>
          <div class="hero-sub">Bienvenido al paraiso</div>
        </div>
      </div>
    </section>
    <h2 class="section-title">Home</h2>
    <section class="carousel"><div class="carousel-track" id="homeCarousel"></div></section>
    <section class="grid" id="homeGrid"></section>
  `;

  /* BANNER: alterna 1 imagen diaria de decorative-images (siempre incluye paradise-beach) */
  const bannerPick = seededPick(DECOS, 1, 'banner')[0] || DECOS[0];
  setHeroImage(bannerPick);

  /* Cargar pool público desde /full */
  const full = pickPublicPool();

  /* Carrusel: 20 aleatorias del pool total /full (semilla A) */
  const car=document.getElementById('homeCarousel');
  const c20 = seededPick(full, 20, 'carousel');
  c20.forEach(it=>{
    const u=imgURL(it); const s=document.createElement('div'); s.className='slide';
    s.innerHTML=`<img src="${u}" alt="">`; car.appendChild(s);
  });

  /* Galería: 20 aleatorias (semilla B, distinta a carrusel) */
  const grid=document.getElementById('homeGrid');
  const g20 = seededPick(full, 20, 'grid');
  g20.forEach((it,i)=>{
    const u=imgURL(it); const id=it.id||it.file||('full-'+i);
    const c=document.createElement('div'); c.className='card'; c.dataset.id=id;
    c.innerHTML=`<img loading="lazy" src="${u}" alt="">`;
    grid.appendChild(c);
  });
}
