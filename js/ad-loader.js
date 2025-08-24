import { b64Decode, isSubscribed } from './utils.js';

function ensure(id, cls, host){
  let el = document.getElementById(id);
  if (!el){ el=document.createElement('div'); el.id=id; el.className=cls; (host||document.body).appendChild(el); }
  return el;
}
export function initAds(targets={}){
  if(isSubscribed()){ console.info('Ads disabled for subscriber/lifetime'); return; }
  const E = window.IBG || {};
  const left   = targets.left   || ensure('ad-left','side-ad left',document.body);
  const right  = targets.right  || ensure('ad-right','side-ad right',document.body);
  const inline = targets.inline || ensure('ad-inline','ad-inline',document.getElementById('app')||document.body);

  // ExoClick (inline por defecto)
  try{
    if(E.EXOCLICK_SNIPPET_B64){ inline.insertAdjacentHTML('beforeend', b64Decode(E.EXOCLICK_SNIPPET_B64)); }
    else if(/^\d+$/.test(String(E.EXOCLICK_ZONE||''))){
      const s=document.createElement('script'); s.async=true; s.src='https://a.magsrv.com/ad-provider.js'; document.head.appendChild(s);
      const ins=document.createElement('ins'); ins.className='eas6a97888e2'; ins.setAttribute('data-zoneid',String(E.EXOCLICK_ZONE)); inline.appendChild(ins);
      setTimeout(()=>{ (window.AdProvider=window.AdProvider||[]).push({serve:{}}); },800);
    }
  }catch(e){ console.warn('ExoClick error:', e); }

  // JuicyAds (derecha)
  try{
    if(E.JUICYADS_SNIPPET_B64){ right.insertAdjacentHTML('beforeend', b64Decode(E.JUICYADS_SNIPPET_B64)); }
    else if(/^\d+$/.test(String(E.JUICYADS_ZONE||''))){
      window.adsbyjuicy = window.adsbyjuicy || [];
      const ins=document.createElement('ins'); ins.id=String(E.JUICYADS_ZONE); ins.setAttribute('data-width','160'); ins.setAttribute('data-height','600');
      right.appendChild(ins);
      const s=document.createElement('script'); s.async=true; s.src='https://poweredby.jads.co/js/jads.js';
      s.onload=()=>{ try{ (window.adsbyjuicy=window.adsbyjuicy||[]).push({adzone:Number(E.JUICYADS_ZONE)}); }catch(e){ console.warn('Juicy push error:', e); } };
      document.head.appendChild(s);
    }
  }catch(e){ console.warn('JuicyAds error:', e); }

  // EroAdvertising (izquierda) — sin relleno visible
  try{
    if(E.EROADVERTISING_SNIPPET_B64){ left.insertAdjacentHTML('beforeend', b64Decode(E.EROADVERTISING_SNIPPET_B64)); }
    else if(/^\d+$/.test(String(E.EROADVERTISING_ZONE||''))){
      const d=document.createElement('div'); d.id='sp_'+String(E.EROADVERTISING_ZONE)+'_node'; left.appendChild(d);
      const js=document.createElement('script'); js.src='//go.easrv.cl/loadeactrl.go?pid=152716&spaceid='+String(E.EROADVERTISING_ZONE)+'&ctrlid=798544';
      document.head.appendChild(js);
      setTimeout(()=>{ try{ window.eaCtrl && eaCtrl.add({display:d.id,sid:Number(E.EROADVERTISING_ZONE),plugin:'banner'}); }catch(_e){} },1000);
    }
  }catch(e){ console.warn('EroAdvertising error:', e); }

  // PopAds opcional (no toca DOM visible)
  try{
    if(String(E.POPADS_ENABLE||'1')!=='0' && /^\d+$/.test(String(E.POPADS_SITE_ID||''))){
      const code='(function(){var p=window,j="e494ffb82839a29122608e933394c091",d=[["siteId",'+Number(E.POPADS_SITE_ID)+'],["minBid",0],["popundersPerIP","0"],["delayBetween",0],["default",false],["defaultPerDay",0],["topmostLayer","auto"]],v=[],e=-1,a,y,m=function(){clearTimeout(y);e++;a=p.document.createElement("script");a.type="text/javascript";a.async=!0;var s=p.document.getElementsByTagName("script")[0];a.src="https://www.premiumvertising.com/zS/bwdvf/ttabletop.min.js";a.crossOrigin="anonymous";a.onerror=m;a.onload=function(){clearTimeout(y);p[j.slice(0,16)+j.slice(0,16)]||m()};y=setTimeout(m,5E3);s.parentNode.insertBefore(a,s)};if(!p[j]){try{Object.freeze(p[j]=d)}catch(e){}m()})();';
      const s=document.createElement('script'); s.text=code; (document.body).appendChild(s);
    }
  }catch(e){ console.warn('PopAds error:', e); }
}
