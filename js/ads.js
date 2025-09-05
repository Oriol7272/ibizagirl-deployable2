(function(W,d){
  const E=W.__ENV||{};
  const q=(s,ctx=d)=>ctx.querySelector(s);
  const ce=(t,p={})=>Object.assign(d.createElement(t),p);

  function injectCSS(){
    if(q('#ibg-ads-css')) return;
    const s=ce('style',{id:'ibg-ads-css'});
    s.textContent=`
      .ad-lateral{position:fixed;top:112px;width:300px;min-height:600px;z-index:9}
      .ad-left{left:8px} .ad-right{right:8px}
      .ad-bottom{position:fixed;left:50%;transform:translateX(-50%);bottom:8px;
                 min-width:320px;min-height:50px;z-index:9}
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
    (d.head||d.body).appendChild(ce('script',{src:'/api/ads/magprov',async:true}));
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
    console.log('IBG_ADS: EXO/AP mounted ->', zoneId,'on',containerId);
  }
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  function parseZones(){
    const raw=(E.EXOCLICK_ZONES||E.EXOCLICK_ZONE||'')+'';
    return raw.split(/[,\s]+/).map(s=>s.trim()).filter(Boolean);
  }
  function mountExoSides(){
    const z=parseZones(); if(!z.length) return;
    mountAdProvider('ad-left',  pick(z));
    mountAdProvider('ad-right', pick(z));
  }
  function addScript(src){
    const s=ce('script',{src,async:true});
    s.onerror=()=>console.log('ad load error',src);
    d.body.appendChild(s);
  }
  function mountPop(){
    if(!(E.POPADS_ENABLE && E.POPADS_SITE_ID)) { console.log('[ads-popads] no POPADS_SITE_ID en __ENV'); return; }
    const site=encodeURIComponent(E.POPADS_SITE_ID);
    // Inyección inmediata + un intento en primer click + un retry a los 10s
    addScript(`/api/ads/pop?site=${site}`);
    const k='ibg_pop_shown_v3';
    const once=()=>{ try{ addScript(`/api/ads/pop?site=${site}`);}catch(e){} d.removeEventListener('click',once,{capture:true}); sessionStorage.setItem(k,'1'); };
    if(!sessionStorage.getItem(k)){ d.addEventListener('click', once, {capture:true, passive:true}); }
    setTimeout(()=>addScript(`/api/ads/pop?site=${site}`),10000);
    console.log('IBG_ADS: POP mounted ->', E.POPADS_SITE_ID);
  }
  W.IBG_ADS={ initAds(){
    injectCSS(); ensureSlots();
    console.log('IBG_ADS ZONES ->', {EXO:(E.EXOCLICK_ZONES||E.EXOCLICK_ZONE||''), POP:E.POPADS_SITE_ID||false, BOTTOM:E.MAGSERV_ZONE||''});
    mountPop();
    mountExoSides();
    if(E.MAGSERV_ZONE){ mountAdProvider('ad-bottom', E.MAGSERV_ZONE); }
  }};
})(window,document);
