import './i18n.js';
import {getDailySets} from './daily-picks.js';
import {renderCarousel, renderGrid, setCounter} from './ui-render.js';
import {mountAds} from './ads.js';
import {wirePurchases} from './purchase-ui.js';
import './background.js';
import {startBannerRotation} from './banner-rotator.js';

(function bootstrap(){
  const p = localStorage.getItem('plan')||'none';
  if(p==='lifetime') document.documentElement.classList.add('hide-ads');
})();

function initHome(){
  const {full20, premium100, vids20}=getDailySets();
  const elC=document.getElementById('home-carousel');
  if(elC) renderCarousel(elC, full20);
  const elP=document.getElementById('home-premium-grid');
  if(elP){ renderGrid(elP, premium100, {withPrice:true, lock:true, kind:'photo'}); setCounter('#home-premium-counter', premium100.length, premium100.filter(x=>x.isNew).length); }
  const elV=document.getElementById('home-videos-grid');
  if(elV){ renderGrid(elV, vids20, {withPrice:true, lock:true, kind:'video'}); setCounter('#home-videos-counter', vids20.length); }
  startBannerRotation();
}
function initOthers(){
  const P=document.getElementById('premium-grid'), V=document.getElementById('videos-grid');
  if(P||V){
    const {premium100, vids20}=getDailySets();
    if(P){ renderGrid(P, premium100, {withPrice:true, lock:true, kind:'photo'}); setCounter('#premium-counter', premium100.length, premium100.filter(x=>x.isNew).length); }
    if(V){ renderGrid(V, vids20, {withPrice:true, lock:true, kind:'video'}); setCounter('#videos-counter', vids20.length); }
  }
}
window.addEventListener('DOMContentLoaded', ()=>{
  if(document.getElementById('home-carousel')) initHome(); else initOthers();
  window.I18N && window.I18N.translate();
  mountAds();
  wirePurchases();
  const ls=document.getElementById('lang-select'); if(ls){ ls.addEventListener('change', e=>{ window.I18N.setLang(e.target.value); }); }
  const bl=document.getElementById('buy-lifetime'); if(bl){ bl.addEventListener('click', ()=>{ const m=document.getElementById('paypal-modal'); if(m) m.classList.remove('hidden'); import('./payments.js').then(p=>p.buyLifetime()); }); }
});
