import {abLabel} from './ab.js';

function env(k){const E=window.__ENV||{};return E[k]||''}
function zone(network){
  const map={ exo:env('EXOCLICK_ZONE'), juicy:env('JUICYADS_ZONE'), ero:env('EROADVERTISING_ZONE'), pop:env('POPADS_SITE_ID') };
  return map[network];
}
function injectIframe(slot, src){
  const ifr=document.createElement('iframe');
  ifr.loading='lazy';
  ifr.referrerPolicy='no-referrer';
  ifr.style.cssText='border:0;width:300px;height:250px;display:block';
  ifr.src=src;
  ifr.onerror=()=>{ slot.style.display='none'; };
  slot.appendChild(ifr);
}
export function mountSideAds(){
  const v=abLabel();
  const order = (v==='A')? ['juicy','exo','ero','pop'] : ['exo','juicy','ero','pop'];
  document.querySelectorAll('.ad-slot').forEach((slot,i)=>{
    const net=(slot.dataset.network||order[i%order.length]||'').toLowerCase();
    const z=(slot.dataset.zone||zone(net)||'').trim();
    if(!z || z==='0'){ slot.style.display='none'; return; }
    if(net==='juicy'){
      injectIframe(slot, `https://js.juicyads.com/adshow.php?adzone=${encodeURIComponent(z)}`);
    }else if(net==='exo'){
      injectIframe(slot, `https://a.exoclick.com/iframe.php?zoneid=${encodeURIComponent(z)}`);
    }else if(net==='ero'){
      injectIframe(slot, `https://www.ero-advertising.com/banner.php?zoneid=${encodeURIComponent(z)}`);
    }else{
      slot.style.display='none';
    }
  });
}
document.addEventListener('DOMContentLoaded',()=>mountSideAds());
