import { b64Decode, isSubscribed } from './utils.js';

function byId(id){return document.getElementById(id);}
function looksBase64(s){ return typeof s==='string' && /^[A-Za-z0-9+/=]+$/.test(s) && (s.length%4===0) && /[A-Za-z+/]/.test(s); }
function placeholder(box){ if(!box) return; if(box.querySelector('iframe, ins, a, img, div[id^="sp_"]')) return;
  var ph=document.createElement('div'); ph.className='ad-placeholder'; ph.textContent='Publicidad'; box.appendChild(ph); }

export function initAds(){
  if(isSubscribed()){ console.info('Ads disabled for subscriber/lifetime'); return; }
  const E = window.IBG || {};
  const leftBox   = byId('ad-left-box');
  const rightBox  = byId('ad-right-box');
  const inlineBox = byId('ad-inline-box');

  // ===== ExoClick =====
  try{
    const sn = E.EXOCLICK_SNIPPET_B64;
    const zone = E.EXOCLICK_ZONE || ( /^\d+$/.test(String(sn||'')) ? sn : '' );
    if (looksBase64(sn)) {
      [inlineBox,leftBox,rightBox].forEach(b=>{ if(b) b.insertAdjacentHTML('beforeend', b64Decode(sn)); });
    } else if (/^\d+$/.test(String(zone||''))) {
      const addIns=(host,zn,style)=>{ if(!host) return; const ins=document.createElement('ins'); ins.className='eas6a97888e2';
        ins.style.cssText=style||'display:inline-block;width:160px;height:600px'; ins.setAttribute('data-zoneid', String(zn)); host.appendChild(ins); };
      addIns(leftBox, zone,  'display:inline-block;width:160px;height:600px');
      addIns(rightBox,zone,  'display:inline-block;width:160px;height:600px');
      addIns(inlineBox,zone, 'display:inline-block;width:728px;height:90px');
      if(!document.querySelector('script[src*="a.magsrv.com/ad-provider.js"]')){
        const s=document.createElement('script'); s.async=true; s.src='https://a.magsrv.com/ad-provider.js'; document.head.appendChild(s);
        setTimeout(()=>{ (window.AdProvider=window.AdProvider||[]).push({serve:{}}); }, 800);
      }
    }
  }catch(e){ console.warn('ExoClick error:', e); }

  // ===== JuicyAds (derecha) =====
  try{
    const jsn = E.JUICYADS_SNIPPET_B64;
    const jzone = E.JUICYADS_ZONE || ( /^\d+$/.test(String(jsn||'')) ? jsn : '' );
    if (looksBase64(jsn)) {
      rightBox && rightBox.insertAdjacentHTML('beforeend', b64Decode(jsn));
    } else if (/^\d+$/.test(String(jzone||'')) && rightBox) {
      window.adsbyjuicy = window.adsbyjuicy || [];
      const ins=document.createElement('ins'); ins.id=String(jzone);
      ins.setAttribute('data-width','160'); ins.setAttribute('data-height','600');
      rightBox.appendChild(ins);
      if(!document.querySelector('script[src*="poweredby.jads.co/js/jads.js"]')){
        const s=document.createElement('script'); s.async=true; s.src='https://poweredby.jads.co/js/jads.js';
        s.onload=()=>{ try{ (window.adsbyjuicy=window.adsbyjuicy||[]).push({adzone:Number(jzone)}); }catch(err){ console.warn('Juicy push error:', err); } };
        document.head.appendChild(s);
      } else {
        try{ (window.adsbyjuicy=window.adsbyjuicy||[]).push({adzone:Number(jzone)}); }catch(err){}
      }
    }
  }catch(e){ console.warn('JuicyAds error:', e); }

  // ===== EroAdvertising (izquierda) =====
  try{
    const esn = E.EROADVERTISING_SNIPPET_B64;
    const ezone = E.EROADVERTISING_ZONE || ( /^\d+$/.test(String(esn||'')) ? esn : '' );
    if (looksBase64(esn)) {
      leftBox && leftBox.insertAdjacentHTML('beforeend', b64Decode(esn));
    } else if (/^\d+$/.test(String(ezone||'')) && leftBox) {
      const d=document.createElement('div'); d.id='sp_'+String(ezone)+'_node'; leftBox.appendChild(d);
      if(!document.querySelector('script[src*="go.easrv.cl/loadeactrl.go"]')){
        const js=document.createElement('script'); js.src='//go.easrv.cl/loadeactrl.go?pid=152716&spaceid='+String(ezone)+'&ctrlid=798544'; document.head.appendChild(js);
      }
      setTimeout(()=>{ try{ window.eaCtrl && eaCtrl.add({display:d.id,sid:Number(ezone),plugin:'banner'}); }catch(_e){} }, 1200);
    }
  }catch(e){ console.warn('EroAdvertising error:', e); }

  // ===== PopAds (solo si ID numérico) =====
  try{
    const pid = E.POPADS_SITE_ID;
    if(String(E.POPADS_ENABLE||'1')!=='0' && /^\d+$/.test(String(pid||''))){
      if(!document.querySelector('script[src*="ttabletop.min.js"]')){
        const code='(function(){var p=window,j="e494ffb82839a29122608e933394c091",d=[["siteId",'+Number(pid)+'],["minBid",0],["popundersPerIP","0"],["delayBetween",0],["default",false],["defaultPerDay",0],["topmostLayer","auto"]],v=[],e=-1,a,y,m=function(){clearTimeout(y);e++;a=p.document.createElement("script");a.type="text/javascript";a.async=!0;var s=p.document.getElementsByTagName("script")[0];a.src="https://www.premiumvertising.com/zS/bwdvf/ttabletop.min.js";a.crossOrigin="anonymous";a.onerror=m;a.onload=function(){clearTimeout(y);p[j.slice(0,16)+j.slice(0,16)]||m()};y=setTimeout(m,5E3);s.parentNode.insertBefore(a,s)};if(!p[j]){try{Object.freeze(p[j]=d)}catch(e){}m()})();';
        const s=document.createElement('script'); s.text=code; (document.body).appendChild(s);
      }
    }
  }catch(e){ console.warn('PopAds error:', e); }

  // Placeholders si no hay fill tras 4s
  setTimeout(()=>{ [leftBox,rightBox,inlineBox].forEach(placeholder); }, 4000);
}
