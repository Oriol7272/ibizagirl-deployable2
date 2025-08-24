import { b64Decode, isSubscribed } from './utils.js';
export function initAds(targets={}) {
  if (isSubscribed()) { console.info('Ads disabled (subscriber/lifetime)'); return; }
  const E = window.IBG || {};
  const mount = (el) => el || document.body;

  if (E.EXOCLICK_SNIPPET_B64) { mount(targets.left).insertAdjacentHTML('beforeend', b64Decode(E.EXOCLICK_SNIPPET_B64)); }
  else if (E.EXOCLICK_ZONE) {
    const s=document.createElement('script'); s.async=true; s.src='https://a.magsrv.com/ad-provider.js'; document.head.appendChild(s);
    const ins=document.createElement('ins'); ins.className='eas6a97888e2'; ins.setAttribute('data-zoneid',E.EXOCLICK_ZONE);
    mount(targets.left).appendChild(ins);
    setTimeout(()=>{ (window.AdProvider=window.AdProvider||[]).push({serve:{}}); },800);
  }

  if (E.JUICYADS_SNIPPET_B64) { mount(targets.right).insertAdjacentHTML('beforeend', b64Decode(E.JUICYADS_SNIPPET_B64)); }
  else if (E.JUICYADS_ZONE) {
    const s=document.createElement('script'); s.async=true; s.src='https://poweredby.jads.co/js/jads.js'; document.head.appendChild(s);
    const ins=document.createElement('ins'); ins.id=E.JUICYADS_ZONE; ins.setAttribute('data-width','160'); ins.setAttribute('data-height','600');
    mount(targets.right).appendChild(ins);
    setTimeout(()=>{ (window.adsbyjuicy=window.adsbyjuicy||[]).push({adzone: Number(E.JUICYADS_ZONE)}) },500);
  }

  if (E.EROADVERTISING_SNIPPET_B64) { mount(targets.right).insertAdjacentHTML('beforeend', b64Decode(E.EROADVERTISING_SNIPPET_B64)); }
  else if (E.EROADVERTISING_ZONE) {
    const d=document.createElement('div'); d.id='sp_'+E.EROADVERTISING_ZONE+'_node'; d.innerHTML='&nbsp;';
    mount(targets.right).appendChild(d);
    const js=document.createElement('script'); js.src='//go.easrv.cl/loadeactrl.go?pid=152716&spaceid='+E.EROADVERTISING_ZONE+'&ctrlid=798544'; document.head.appendChild(js);
    setTimeout(()=>{ window.eaCtrl ? eaCtrl.add({display:d.id,sid:Number(E.EROADVERTISING_ZONE),plugin:'banner'}) : null; },1000);
  }

  if ((E.POPADS_ENABLE||'0')!=='0' && E.POPADS_SITE_ID) {
    const code = '(function(){var p=window,j="e494ffb82839a29122608e933394c091",d=[["siteId",'+E.POPADS_SITE_ID+'],["minBid",0],["popundersPerIP","0"],["delayBetween",0],["default",false],["defaultPerDay",0],["topmostLayer","auto"]],v=[],e=-1,a,y,m=function(){clearTimeout(y);e++;a=p.document.createElement("script");a.type="text/javascript";a.async=!0;var s=p.document.getElementsByTagName("script")[0];a.src="https://www.premiumvertising.com/zS/bwdvf/ttabletop.min.js";a.crossOrigin="anonymous";a.onerror=m;a.onload=function(){clearTimeout(y);p[j.slice(0,16)+j.slice(0,16)]||m()};y=setTimeout(m,5E3);s.parentNode.insertBefore(a,s)};if(!p[j]){try{Object.freeze(p[j]=d)}catch(e){}m()})();';
    const s=document.createElement('script'); s.text = code;
    mount(targets.right).appendChild(s);
  }
}
