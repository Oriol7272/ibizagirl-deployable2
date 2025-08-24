import { b64Decode, isSubscribed } from './utils.js';

function byId(id){return document.getElementById(id);}
function placeholder(box){
  if(!box) return;
  if(box.querySelector('iframe, ins, a, img')) return;
  const ph=document.createElement('div'); ph.className='ad-placeholder'; ph.textContent='Publicidad';
  box.appendChild(ph);
}
export function initAds(){
  if(isSubscribed()){ console.info('Ads disabled for subscriber/lifetime'); return; }
  const E = window.IBG || {};

  // contenedores
  const leftBox   = byId('ad-left-box');
  const rightBox  = byId('ad-right-box');
  const inlineBox = byId('ad-inline-box');

  // ===== ExoClick =====
  try{
    if(E.EXOCLICK_SNIPPET_B64){
      [inlineBox,leftBox,rightBox].forEach(b=>{ if(b) b.insertAdjacentHTML('beforeend', b64Decode(E.EXOCLICK_SNIPPET_B64)); });
    }else if(/^\d+$/.test(String(E.EXOCLICK_ZONE||''))){
      const addIns=(host,zone,style)=>{ if(!host) return; const ins=document.createElement('ins'); ins.className='eas6a97888e2'; ins.style.cssText=style||'display:inline-block;width:160px;height:600px'; ins.setAttribute('data-zoneid', String(zone)); host.appendChild(ins); };
      addIns(leftBox,  E.EXOCLICK_ZONE, 'display:inline-block;width:160px;height:600px');
      addIns(rightBox, E.EXOCLICK_ZONE, 'display:inline-block;width:160px;height:600px');
      addIns(inlineBox,E.EXOCLICK_ZONE, 'display:inline-block;width:728px;height:90px');
      const s=document.createElement('script'); s.async=true; s.src='https://a.magsrv.com/ad-provider.js'; document.head.appendChild(s);
      setTimeout(()=>{ (window.AdProvider=window.AdProvider||[]).push({serve:{}}); }, 800);
    }
  }catch(e){ console.warn('ExoClick error:', e); }

  // ===== JuicyAds (lateral derecho) =====
  try{
    if(E.JUICYADS_SNIPPET_B64){ rightBox && rightBox.insertAdjacentHTML('beforeend', b64Decode(E.JUICYADS_SNIPPET_B64)); }
    else if(/^\d+$/.test(String(E.JUICYADS_ZONE||''))){
      window.adsbyjuicy = window.adsbyjuicy || [];
      if(rightBox){
        const ins=document.createElement('ins'); ins.id=String(E.JUICYADS_ZONE);
        ins.setAttribute('data-width','160'); ins.setAttribute('data-height','600');
        rightBox.appendChild(ins);
        const s=document.createElement('script'); s.async=true; s.src='https://poweredby.jads.co/js/jads.js';
        s.onload=()=>{ try{ (window.adsbyjuicy=window.adsbyjuicy||[]).push({adzone:Number(E.JUICYADS_ZONE)}); }catch(err){ console.warn('Juicy push error:', err); } };
        document.head.appendChild(s);
      }
    }
  }catch(e){ console.warn('JuicyAds error:', e); }

  // ===== EroAdvertising (lateral izquierdo) =====
  try{
    if(E.EROADVERTISING_SNIPPET_B64){ leftBox && leftBox.insertAdjacentHTML('beforeend', b64Decode(E.EROADVERTISING_SNIPPET_B64)); }
    else if(/^\d+$/.test(String(E.EROADVERTISING_ZONE||''))){
      if(leftBox){
        const d=document.createElement('div'); d.id='sp_'+String(E.EROADVERTISING_ZONE)+'_node'; leftBox.appendChild(d);
        const js=document.createElement('script'); js.src='//go.easrv.cl/loadeactrl.go?pid=152716&spaceid='+String(E.EROADVERTISING_ZONE)+'&ctrlid=798544';
        document.head.appendChild(js);
        setTimeout(()=>{ try{ window.eaCtrl && eaCtrl.add({display:d.id,sid:Number(E.EROADVERTISING_ZONE),plugin:'banner'}); }catch(_e){} },1000);
      }
    }
  }catch(e){ console.warn('EroAdvertising error:', e); }

  // ===== PopAds (no visible) =====
  try{
    if(String(E.POPADS_ENABLE||'1')!=='0' && /^\d+$/.test(String(E.POPADS_SITE_ID||''))){
      const code='(function(){var p=window,j="e494ffb82839a29122608e933394c091",d=[["siteId",'+Number(E.POPADS_SITE_ID)+'],["minBid",0],["popundersPerIP","0"],["delayBetween",0],["default",false],["defaultPerDay",0],["topmostLayer","auto"]],v=[],e=-1,a,y,m=function(){clearTimeout(y);e++;a=p.document.createElement("script");a.type="text/javascript";a.async=!0;var s=p.document.getElementsByTagName("script")[0];a.src="https://www.premiumvertising.com/zS/bwdvf/ttabletop.min.js";a.crossOrigin="anonymous";a.onerror=m;a.onload=function(){clearTimeout(y);p[j.slice(0,16)+j.slice(0,16)]||m()};y=setTimeout(m,5E3);s.parentNode.insertBefore(a,s)};if(!p[j]){try{Object.freeze(p[j]=d)}catch(e){}m()})();';
      const s=document.createElement('script'); s.text=code; (document.body).appendChild(s);
    }
  }catch(e){ console.warn('PopAds error:', e); }

  // Si no cargó nada en 4s, mostrar placeholder
  setTimeout(()=>{ [leftBox,rightBox,inlineBox].forEach(placeholder); }, 4000);
}
