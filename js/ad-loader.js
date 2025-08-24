import { b64Decode, isSubscribed } from './utils.js';
function isInt(v){return /^\d+$/.test(String(v||'').trim());}
export function initAds(targets={}){
  if(isSubscribed()){ console.info('Ads disabled for subscriber/lifetime'); return; }
  const E = window.IBG || {};
  const mount = el => el || document.body;

  // ExoClick
  try{
    if(E.EXOCLICK_SNIPPET_B64){ mount(targets.left).insertAdjacentHTML('beforeend', b64Decode(E.EXOCLICK_SNIPPET_B64)); }
    else if(isInt(E.EXOCLICK_ZONE)){
      const s=document.createElement('script'); s.async=true; s.src='https://a.magsrv.com/ad-provider.js'; document.head.appendChild(s);
      const ins=document.createElement('ins'); ins.className='eas6a97888e2'; ins.setAttribute('data-zoneid',String(E.EXOCLICK_ZONE)); mount(targets.left).appendChild(ins);
      setTimeout(()=>{ (window.AdProvider=window.AdProvider||[]).push({serve:{}}); },800);
    }
  }catch(e){ console.warn('ExoClick error:', e); }

  // JuicyAds
  try{
    if(E.JUICYADS_SNIPPET_B64){ mount(targets.right).insertAdjacentHTML('beforeend', b64Decode(E.JUICYADS_SNIPPET_B64)); }
    else if(isInt(E.JUICYADS_ZONE)){
      window.adsbyjuicy = window.adsbyjuicy || [];
      const ins=document.createElement('ins'); ins.id=String(E.JUICYADS_ZONE); ins.setAttribute('data-width','160'); ins.setAttribute('data-height','600'); mount(targets.right).appendChild(ins);
      const s=document.createElement('script'); s.async=true; s.src='https://poweredby.jads.co/js/jads.js';
      s.onload=()=>{ try{ (window.adsbyjuicy=window.adsbyjuicy||[]).push({adzone:Number(E.JUICYADS_ZONE)}); }catch(e){ console.warn('Juicy push error:', e); } };
      document.head.appendChild(s);
    }
  }catch(e){ console.warn('JuicyAds error:', e); }

  // EroAdvertising
  try{
    if(E.EROADVERTISING_SNIPPET_B64){ mount(targets.right).insertAdjacentHTML('beforeend', b64Decode(E.EROADVERTISING_SNIPPET_B64)); }
    else if(isInt(E.EROADVERTISING_ZONE)){
      const d=document.createElement('div'); d.id='sp_'+String(E.EROADVERTISING_ZONE)+'_node'; d.innerHTML='&nbsp;'; mount(targets.right).appendChild(d);
      const js=document.createElement('script'); js.src='//go.easrv.cl/loadeactrl.go?pid=152716&spaceid='+String(E.EROADVERTISING_ZONE)+'&ctrlid=798544'; document.head.appendChild(js);
      setTimeout(()=>{ try{ window.eaCtrl && eaCtrl.add({display:d.id,sid:Number(E.EROADVERTISING_ZONE),plugin:'banner'}); }catch(_e){} },1000);
    }
  }catch(e){ console.warn('EroAdvertising error:', e); }

  // PopAds (solo si ID numérico y habilitado)
  try{
    if(isInt(E.POPADS_SITE_ID) && String(E.POPADS_ENABLE)!=='0'){
      const code='(function(){var p=window,j="e494ffb82839a29122608e933394c091",d=[["siteId",'+Number(E.POPADS_SITE_ID)+'],["minBid",0],["popundersPerIP","0"],["delayBetween",0],["default",false],["defaultPerDay",0],["topmostLayer","auto"]],v=[],e=-1,a,y,m=function(){clearTimeout(y);e++;a=p.document.createElement("script");a.type="text/javascript";a.async=!0;var s=p.document.getElementsByTagName("script")[0];a.src="https://www.premiumvertising.com/zS/bwdvf/ttabletop.min.js";a.crossOrigin="anonymous";a.onerror=m;a.onload=function(){clearTimeout(y);p[j.slice(0,16)+j.slice(0,16)]||m()};y=setTimeout(m,5E3);s.parentNode.insertBefore(a,s)};if(!p[j]){try{Object.freeze(p[j]=d)}catch(e){}m()})();';
      const s=document.createElement('script'); s.text=code; mount(targets.right).appendChild(s);
    }
  }catch(e){ console.warn('PopAds error:', e); }
}
