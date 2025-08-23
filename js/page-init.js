import {getDailySets} from './daily-picks.js';
import {renderCarousel, renderGrid, setCounter} from './ui-render.js';
import {mountSideAds} from './ads.js';
import {wirePurchases} from './purchase-ui.js';
import {seedToday} from './utils.js';
import {startBannerRotation} from './banner-rotator.js';

(function bootstrap(){
  const p = localStorage.getItem('plan')||'none';
  if(p==='lifetime') document.documentElement.classList.add('hide-ads');
})();

function initHome(){ const {full20}=getDailySets(); renderCarousel(document.getElementById('home-carousel'), full20); startBannerRotation(); }
function initPremium(){ const {premium100}=getDailySets(); renderGrid(document.getElementById('premium-grid'), premium100, {withPrice:true, lock:true, kind:'photo'}); setCounter('#premium-counter', premium100.length, premium100.filter(x=>x.isNew).length); }
function initVideos(){ const {vids20}=getDailySets(); renderGrid(document.getElementById('videos-grid'), vids20, {withPrice:true, lock:true, kind:'video'}); setCounter('#videos-counter', vids20.length); }

window.addEventListener('DOMContentLoaded', ()=>{
  if(document.getElementById('home-carousel')) initHome();
  if(document.getElementById('premium-grid')) initPremium();
  if(document.getElementById('videos-grid')) initVideos();
  mountSideAds();
  wirePurchases();
});
