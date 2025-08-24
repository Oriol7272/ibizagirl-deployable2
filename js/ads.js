function mountJuicy(el, zone){
  const s1=document.createElement('script'); s1.setAttribute('data-cfasync','false'); s1.async=true; s1.src='https://poweredby.jads.co/js/jads.js';
  const ins=document.createElement('ins'); ins.id=String(zone); ins.setAttribute('data-width','300'); ins.setAttribute('data-height','250');
  const s2=document.createElement('script'); s2.setAttribute('data-cfasync','false'); s2.async=true; s2.innerHTML="(adsbyjuicy = window.adsbyjuicy || []).push({'adzone':"+JSON.stringify(Number(zone))+ "});";
  el.appendChild(s1); el.appendChild(ins); el.appendChild(s2);
}
function mountExo(el, zone){
  const s=document.createElement('script'); s.async=true; s.type='application/javascript'; s.src='https://a.magsrv.com/ad-provider.js';
  const ins=document.createElement('ins'); ins.setAttribute('data-zoneid', String(zone)); ins.className='eas'+String(zone);
  const push=document.createElement('script'); push.innerHTML='(AdProvider = window.AdProvider || []).push({"serve": {}});';
  el.appendChild(s); el.appendChild(ins); el.appendChild(push);
}
function mountEro(el, spaceId, pid, ctrlid){
  const divId='sp_'+spaceId+'_node'; const div=document.createElement('div'); div.id=divId; div.innerHTML='&nbsp;'; el.appendChild(div);
  const boot=()=>{ window.eaCtrl=window.eaCtrl || {add:(ag)=>{(window.eaCtrlRecs=window.eaCtrlRecs||[]).push(ag)}}; window.eaCtrl.add({"display":divId,"sid":Number(spaceId),"plugin":"banner"}); };
  if(!document.getElementById('ea-loader')){
    const js=document.createElement('script'); js.id='ea-loader';
    js.src='//go.easrv.cl/loadeactrl.go?pid='+(window.__ENV?.ERO_PID||'')+'&spaceid='+spaceId+'&ctrlid='+(window.__ENV?.ERO_CTRLID||'');
    document.head.appendChild(js); js.onload=boot; js.onerror=boot;
  } else boot();
}
function mountPopAds(siteId){
  const s=document.createElement('script'); s.type='text/javascript';
  s.innerHTML="var _pop=_pop||[];_pop.push(['siteId',"+JSON.stringify(siteId)+"]);_pop.push(['minBid',0]);_pop.push(['default',false]);(function(){var pa=document.createElement('script');pa.type='text/javascript';pa.async=true;pa.src='//c1.popads.net/pop.js';var s=document.getElementsByTagName('script')[0];s.parentNode.insertBefore(pa,s);})();";
  document.head.appendChild(s);
}
function mountSideAds(){
  if(window.__ENV?.ADS_ENABLED==='false' || document.documentElement.classList.contains('hide-ads')) return;
  const left=document.getElementById('side-ads-left'), right=document.getElementById('side-ads-right');
  [left,right].forEach((el)=>{ if(!el) return;
    const env=window.__ENV||{};
    const juicy = el.querySelector('[data-net="juicy"]');
    const exo   = el.querySelector('[data-net="exo"]');
    const ero   = el.querySelector('[data-net="ero"]');
    if(juicy && env.JUICYADS_ZONE) mountJuicy(juicy, env.JUICYADS_ZONE);
    if(exo   && env.EXOCLICK_ZONE) mountExo(exo, env.EXOCLICK_ZONE);
    if(ero   && env.EROADVERTISING_ZONE) mountEro(ero, env.EROADVERTISING_ZONE, env.ERO_PID, env.ERO_CTRLID);
  });
  if(window.__ENV?.POPADS_SITE_ID) mountPopAds(window.__ENV.POPADS_SITE_ID);
}
function mountAds(){ mountSideAds(); }
window.ADS={ mountAds, mountSideAds };
export { mountAds, mountSideAds };
