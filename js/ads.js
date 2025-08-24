const ENV=window.__ENV||{};
const JUICY_ZONE=Number(ENV.ADS_JUICY_ZONE||1099637)||null;
const ERO_ZONE=Number(ENV.ADS_ERO_ZONE||8177575)||null;
const EXO_ZONE=Number(ENV.ADS_EXO_ZONE||5696328)||null;

function mountJuicy(el){
  if(!JUICY_ZONE) return;
  const s=document.createElement('script');
  s.src=`https://js.juicyads.com/adshow.php?adzone=${JUICY_ZONE}`;
  s.async=true; el.appendChild(s);
}
function mountEro(el){
  if(!ERO_ZONE) return;
  const i=document.createElement('iframe');
  i.src=`https://www.eroadvertising.com//banner.php?zoneid=${ERO_ZONE}`;
  i.width="160"; i.height="600"; i.setAttribute('frameborder','0'); i.setAttribute('scrolling','no');
  el.appendChild(i);
}
function mountExo(el){
  if(!EXO_ZONE) return;
  const i=document.createElement('iframe');
  i.src=`https://syndication.exoclick.com/ads-iframe-display.php?idzone=${EXO_ZONE}&output=iframe`;
  i.width="160"; i.height="600"; i.setAttribute('frameborder','0'); i.setAttribute('scrolling','no');
  el.appendChild(i);
}
export function mountAds(){
  document.querySelectorAll('.ad-slot').forEach(slot=>{
    const net=slot.dataset.network;
    try{
      if(net==='juicy') mountJuicy(slot);
      if(net==='ero')   mountEro(slot);
      if(net==='exo')   mountExo(slot);
    }catch(e){console.warn('ad error',net,e);}
  });
}
document.addEventListener('DOMContentLoaded',()=>{try{mountAds();}catch(e){}});
