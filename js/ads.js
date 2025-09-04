(function(W){
  function b64decode(s){ try{ return atob((s||'').trim()); }catch(e){ return ''; } }
  function runScripts(container){
    var scripts = container.querySelectorAll('script');
    scripts.forEach(function(old){
      var s=document.createElement('script');
      if(old.src){ s.src=old.src; s.async=old.async; }
      else { s.textContent=old.textContent; }
      old.replaceWith(s);
    });
  }
  function fillBox(el, label){
    if(!el) return;
    var box=document.createElement('div'); box.className='box';
    box.innerHTML='<div style="text-align:center"><div style="font-weight:800;margin-bottom:6px">'+label+'</div><div style="font-size:12px;opacity:.8">Desactiva AdBlock para ver anuncios</div></div>';
    el.innerHTML=''; el.appendChild(box);
  }
  function initAds(){
    var E=W.__ENV||{};
    // Laterales
    var L=document.getElementById('ad-left');
    var R=document.getElementById('ad-right');
    var B=document.getElementById('ad-bottom');
    // JuicyAds / EroAdvertising: si hay snippet en base64, inyecta
    var injected=false;
    if(E.JUICYADS_SNIPPET_B64){
      var html=b64decode(E.JUICYADS_SNIPPET_B64);
      if(L){ L.innerHTML=html; runScripts(L); injected=true; }
      if(R){ R.innerHTML=html; runScripts(R); injected=true; }
    }
    if(E.EROADVERTISING_SNIPPET_B64){
      var html2=b64decode(E.EROADVERTISING_SNIPPET_B64);
      if(B){ B.innerHTML=html2; runScripts(B); injected=true; }
    }
    // Si no hay snippets reales, mostrar fallback visible
    if(!injected){
      fillBox(L,'Publicidad');
      fillBox(R,'Publicidad');
      if(B){ B.innerHTML='<div class="ad-bottom">Espacio publicitario</div>'; }
    }
  }
  W.IBG_ADS={initAds};
})(window);
