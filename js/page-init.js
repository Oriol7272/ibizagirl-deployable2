import { ENV } from './env.js';
import './i18n.js';
import {getDailySets} from './daily-picks.js';
import {renderCarousel, renderGrid, setCounter} from './ui-render.js';
import * as Ads from "./ads.js";
import {wirePurchases} from './purchase-ui.js';
import {startBannerRotation} from './banner-rotator.js';

(function bootstrap(){
  const p = localStorage.getItem('plan')||'none';
  if(p==='lifetime') document.documentElement.classList.add('hide-ads');
})();

function initHome(){
  const {full20_carousel, full20_grid} = getDailySets();
  const banner=document.getElementById('banner-rotator'); if(banner) startBannerRotation();
  const elC=document.getElementById('home-carousel'); if(elC) renderCarousel(elC, full20_carousel);
  const elG=document.getElementById('home-public-grid'); if(elG){ renderGrid(elG, full20_grid, {publicGrid:true}); setCounter('#home-public-counter', full20_grid.length); }
}

function initPremium(){
  const {premium100}=getDailySets();
  const P=document.getElementById('premium-grid'); if(P){ renderGrid(P, premium100, {withPrice:true, kind:'photo'}); setCounter('#premium-counter', premium100.length, premium100.filter(x=>x.isNew).length); }
}

function initVideos(){
  const {vids20}=getDailySets();
  const V=document.getElementById('videos-grid'); if(V){ renderGrid(V, vids20, {withPrice:true, kind:'video'}); setCounter('#videos-counter', vids20.length); }
}

window.addEventListener('DOMContentLoaded', ()=>{
  if(document.getElementById('home-carousel')) initHome();
  if(document.getElementById('premium-grid')) initPremium();
  if(document.getElementById('videos-grid')) initVideos();
  window.I18N && window.I18N.translate();
  Ads.mountSideAds();
  wirePurchases();
  const ls=document.getElementById('lang-select'); if(ls){ ls.addEventListener('change', e=>{ window.I18N.setLang(e.target.value); }); }
  const bl=document.getElementById('buy-lifetime'); if(bl){ bl.addEventListener('click', ()=>{ const m=document.getElementById('paypal-modal'); if(m) m.classList.remove('hidden'); import('./payments.js').then(p=>p.buyLifetime()); }); }
});

      try{
        if(ENV.CRISP_WEBSITE_ID){
          window.$crisp=[];window.CRISP_WEBSITE_ID=ENV.CRISP_WEBSITE_ID;
          (function(){var d=document,s=d.createElement("script");
          s.src="https://client.crisp.chat/l.js";s.async=1;d.head.appendChild(s)})();
        }
      }catch(e){}
    