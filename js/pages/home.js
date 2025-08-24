import { t } from '../i18n.js';
import { getDaily } from '../daily-picks.js';
export async function initHome(){
  const root=document.getElementById('app');
  root.innerHTML = `
    <h2 style="padding:10px 12px">${t('welcome')}</h2>
    <section class="carousel"><div class="carousel-track" id="homeCarousel"></div></section>
    <section class="grid" id="homeGrid"></section>`;
  const {home20}=getDaily();
  const car=document.getElementById('homeCarousel');
  home20.forEach(it=>{const url=it.thumb||it.src||it.file||it.url||it.path;const s=document.createElement('div');s.className='slide';s.innerHTML=`<img src="${url}" alt="">`;car.appendChild(s);});
  const grid=document.getElementById('homeGrid');
  home20.forEach((it,i)=>{const id=it.id||it.file||`full-${i}`;const url=it.thumb||it.src||it.file||it.url||it.path;const c=document.createElement('div');c.className='card';c.dataset.id=id;c.innerHTML=`<img loading="lazy" src="${url}" alt="">`;grid.appendChild(c);});
}
