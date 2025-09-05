(function(W,d){
  const E=W.__ENV||{};
  const q=(s,ctx=d)=>ctx.querySelector(s);
  const ce=(tag,props={})=>Object.assign(d.createElement(tag),props);

  function addScript(container, src){
    const s=ce('script',{src,async:true});
    s.onerror=()=>console.log('ad load error',src);
    (container||d.body).appendChild(s);
    return s;
  }

  function mountPop(){
    if(!(E.POPADS_ENABLE && E.POPADS_SITE_ID)) return;
    // 1) en load
    addScript(d.body, `/api/ads/pop?site=${encodeURIComponent(E.POPADS_SITE_ID)}`);
    // 2) en 1ª interacción (una vez por sesión)
    const k='ibg_pop_shown_v1';
    if(!sessionStorage.getItem(k)){
      const once=()=>{ try{ addScript(d.body, `/api/ads/pop?site=${encodeURIComponent(E.POPADS_SITE_ID)}`); }catch(e){} sessionStorage.setItem(k,'1'); d.removeEventListener('click',once,{capture:true}); };
      d.addEventListener('click', once, {capture:true, passive:true});
    }
    console.log('IBG_ADS: POP mounted ->', E.POPADS_SITE_ID);
  }

  function mountExo(id, zone){
    const c=q('#'+id); if(!c || !zone) return;
    // limpiamos y metemos script
    c.innerHTML='';
    addScript(c, `/api/ads/exo?zone=${encodeURIComponent(zone)}`);
    console.log(`IBG_ADS: EXO mounted ${id} ->`, zone);
  }

  function mountMagsrv(id, zone){
    const c=q('#'+id); if(!c || !zone) return;
    // cargar provider (proxificado) una sola vez
    if(!W.__MAG_LOADED){ addScript(d.head||d.body, '/api/ads/magprov'); W.__MAG_LOADED=true; }
    // crear INS de Magsrv
    c.innerHTML='';
    const ins=ce('ins'); ins.className='eas6a97888e17';
    ins.setAttribute('data-zoneid', String(zone));
    ins.setAttribute('data-block-ad-types','0');
    c.appendChild(ins);
    // servir
    setTimeout(()=>{ (W.AdProvider=W.AdProvider||[]).push({serve:{}}); }, 250);
    console.log(`IBG_ADS: MAG mounted ${id} ->`, zone);
  }

  function ensureSlots(){
    // crea slots si faltan
    if(!q('#ad-left'))  d.body.appendChild(ce('div',{id:'ad-left', className:'ad-lateral ad-left'}));
    if(!q('#ad-right')) d.body.appendChild(ce('div',{id:'ad-right',className:'ad-lateral ad-right'}));
    if(!q('#ad-bottom'))d.body.appendChild(ce('div',{id:'ad-bottom',className:'ad-bottom'}));
  }

  function injectCSS(){
    if(q('#ibg-ads-css')) return;
    const css=`
      .ad-lateral{position:fixed;top:112px;width:300px;min-height:600px;z-index:9}
      .ad-left{left:8px}
      .ad-right{right:8px}
      .ad-bottom{position:fixed;left:50%;transform:translateX(-50%);bottom:6px;min-width:320px;min-height:50px;z-index:9}
      @media(max-width:1200px){.ad-lateral{display:none}}
    `;
    const s=ce('style',{id:'ibg-ads-css'}); s.textContent=css; (d.head||d.body).appendChild(s);
  }

  W.IBG_ADS = {
    initAds(){
      console.log('IBG_ADS ZONES ->',{POPADS:E.POPADS_ENABLE?E.POPADS_SITE_ID:false, EXO_L:E.EXOCLICK_ZONE_LEFT||E.EXOCLICK_ZONE, EXO_R:E.EXOCLICK_ZONE_RIGHT||E.EXOCLICK_ZONE, MAG:E.MAGSERV_ZONE||''});
      injectCSS(); ensureSlots();
      mountPop();
      // ExoClick a cada lado (usa LEFT/RIGHT si existen; si no, EXOCLICK_ZONE)
      mountExo('ad-left',  E.EXOCLICK_ZONE_LEFT  || E.EXOCLICK_ZONE);
      mountExo('ad-right', E.EXOCLICK_ZONE_RIGHT || E.EXOCLICK_ZONE);
      // Magsrv al fondo
      mountMagsrv('ad-bottom', E.MAGSERV_ZONE);
    }
  };
})(window, document);
