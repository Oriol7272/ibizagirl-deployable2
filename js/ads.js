(function(W,d){
  const E=W.__ENV||{};
  const q=(s,ctx=d)=>ctx.querySelector(s);
  const ce=(t,p={})=>Object.assign(d.createElement(t),p);

  function injectCSS(){
    if(q('#ibg-ads-css')) return;
    const s=ce('style',{id:'ibg-ads-css'});
    s.textContent = `
      .ad-lateral{position:fixed;top:112px;width:300px;min-height:600px;z-index:9}
      .ad-left{left:8px}
      .ad-right{right:8px}
      .ad-bottom{position:fixed;left:50%;transform:translateX(-50%);bottom:6px;min-width:320px;min-height:50px;z-index:9}
      @media(max-width:1200px){.ad-lateral{display:none}}
    `;
    (d.head||d.body).appendChild(s);
  }
  function ensureSlots(){
    if(!q('#ad-left'))  d.body.appendChild(ce('div',{id:'ad-left', className:'ad-lateral ad-left'}));
    if(!q('#ad-right')) d.body.appendChild(ce('div',{id:'ad-right',className:'ad-lateral ad-right'}));
    if(!q('#ad-bottom'))d.body.appendChild(ce('div',{id:'ad-bottom',className:'ad-bottom'}));
  }
  function loadAdProviderOnce(){
    if(W.__ADPROV_LOADED) return;
    var s=ce('script',{src:'/api/ads/magprov',async:true});
    (d.head||d.body).appendChild(s);
    W.__ADPROV_LOADED=true;
  }
  function mountAdProvider(containerId, zoneId){
    const c=q('#'+containerId); if(!c||!zoneId) return;
    loadAdProviderOnce();
    c.innerHTML='';
    const ins=ce('ins'); ins.className='eas6a97888e17';
    ins.setAttribute('data-zoneid', String(zoneId));
    ins.setAttribute('data-block-ad-types','0');
    c.appendChild(ins);
    setTimeout(()=>{ (W.AdProvider=W.AdProvider||[]).push({serve:{}}); },300);
    console.log('IBG_ADS: EXO/AP mounted ->', zoneId, 'on', containerId);
  }
  function pick(list){
    return list[Math.floor(Math.random()*list.length)];
  }
  function parseZones(){
    const raw=(E.EXOCLICK_ZONES || E.EXOCLICK_ZONE || '').toString();
    const arr=raw.split(/[,\s]+/).map(s=>s.trim()).filter(Boolean);
    return arr;
  }
  function mountExoBothSides(){
    const zones=parseZones();
    if(!zones.length) return;
    const leftZone = pick(zones);
    const rightZone= pick(zones);
    mountAdProvider('ad-left', leftZone);
    mountAdProvider('ad-right', rightZone);
  }
  function addScript(src){
    const s=ce('script',{src,async:true});
    s.onerror=()=>console.log('ad load error',src);
    (d.body).appendChild(s);
  }
  function mountPop(){
    if(!(E.POPADS_ENABLE && E.POPADS_SITE_ID)) return;
    addScript(`/api/ads/pop?site=${encodeURIComponent(E.POPADS_SITE_ID)}`);
    const k='ibg_pop_shown_v2';
    if(!sessionStorage.getItem(k)){
      const once=()=>{ try{ addScript(`/api/ads/pop?site=${encodeURIComponent(E.POPADS_SITE_ID)}`);}catch(e){} sessionStorage.setItem(k,'1'); d.removeEventListener('click',once,{capture:true}); };
      d.addEventListener('click', once, {capture:true, passive:true});
    }
    console.log('IBG_ADS: POP mounted ->', E.POPADS_SITE_ID);
  }
  W.IBG_ADS = {
    initAds(){
      injectCSS(); ensureSlots();
      console.log('IBG_ADS ZONES ->',{EXO:(E.EXOCLICK_ZONES||E.EXOCLICK_ZONE||''), POP:E.POPADS_SITE_ID||false, BOTTOM:E.MAGSERV_ZONE||''});
      mountPop();
      mountExoBothSides();
      if(E.MAGSERV_ZONE){ mountAdProvider('ad-bottom', E.MAGSERV_ZONE); }
    }
  };
})(window, document);
