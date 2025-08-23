import {adsDisabled} from './lock-guard.js';
function mountJuicy(el, zone){
  const s1=document.createElement('script');
  s1.setAttribute('data-cfasync','false'); s1.async=true; s1.src='https://poweredby.jads.co/js/jads.js';
  const ins=document.createElement('ins'); ins.id=String(zone); ins.setAttribute('data-width','300'); ins.setAttribute('data-height','250');
  const s2=document.createElement('script');
  s2.setAttribute('data-cfasync','false'); s2.async=true;
  s2.innerHTML="(adsbyjuicy = window.adsbyjuicy || []).push({'adzone':"+JSON.stringify(Number(zone))+ "});";
  el.appendChild(s1); el.appendChild(ins); el.appendChild(s2);
}
function mountExoClick(el, zone){
  const s=document.createElement('script'); s.async=true; s.type='application/javascript'; s.src='https://a.magsrv.com/ad-provider.js';
  const ins=document.createElement('ins'); ins.setAttribute('data-zoneid', String(zone)); ins.className='eas'+String(zone);
  const push=document.createElement('script'); push.innerHTML='(AdProvider = window.AdProvider || []).push({"serve": {}});';
  el.appendChild(s); el.appendChild(ins); el.appendChild(push);
}
function mountEroAdvertising(el, spaceId, pid, ctrlid){
  const divId='sp_'+spaceId+'_node'; const div=document.createElement('div'); div.id=divId; div.innerHTML='&nbsp;'; el.appendChild(div);
  const boot=()=>{ window.eaCtrl=window.eaCtrl || {add:(ag)=>{(window.eaCtrlRecs=window.eaCtrlRecs||[]).push(ag)}}; window.eaCtrl.add({"display":divId,"sid":Number(spaceId),"plugin":"banner"}); };
  if(!document.getElementById('ea-loader')){
    const js=document.createElement('script'); js.id='ea-loader';
    js.src='//go.easrv.cl/loadeactrl.go?pid='+encodeURIComponent(pid||'')+'&spaceid='+encodeURIComponent(spaceId)+'&ctrlid='+encodeURIComponent(ctrlid||'');
    document.head.appendChild(js); js.onload=boot; js.onerror=boot;
  } else { boot(); }
}
function mountPopAds(siteId){
  const s=document.createElement('script'); s.type='text/javascript';
  s.innerHTML="var _pop=_pop||[];_pop.push(['siteId',"+JSON.stringify(siteId)+"]);_pop.push(['minBid',0]);_pop.push(['default',false]);(function(){var pa=document.createElement('script');pa.type='text/javascript';pa.async=true;pa.src='//c1.popads.net/pop.js';var s=document.getElementsByTagName('script')[0];s.parentNode.insertBefore(pa,s);})();";
  document.head.appendChild(s);
}
export function mountAds(){
  if(adsDisabled()){ document.documentElement.classList.add('hide-ads'); return; }
  const env=window.__ENV||{};
  document.querySelectorAll('.ad-slot[data-network]').forEach(el=>{
    const net=el.getAttribute('data-network'); const zoneAttr=el.getAttribute('data-zone');
    if(net==='juicy' && (zoneAttr||env.JUICYADS_ZONE)) mountJuicy(el, zoneAttr||env.JUICYADS_ZONE);
    if(net==='exo'   && (zoneAttr||env.EXOCLICK_ZONE)) mountExoClick(el, zoneAttr||env.EXOCLICK_ZONE);
    if(net==='ero'   && (zoneAttr||env.EROADVERTISING_ZONE)) mountEroAdvertising(el, zoneAttr||env.EROADVERTISING_ZONE, env.ERO_PID, env.ERO_CTRLID);
  });
  if(env.POPADS_SITE_ID) mountPopAds(env.POPADS_SITE_ID);
}
