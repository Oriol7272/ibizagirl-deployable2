(function(W){
  function injectScript(el, src){
    if(!el) return;
    var s=document.createElement('script');
    s.src=src; s.async=true; s.setAttribute('data-cfasync','false');
    el.innerHTML=''; el.appendChild(s);
  }
  function fallback(el,label){
    if(!el) return;
    var box=document.createElement('div'); box.className='box';
    box.innerHTML='<div style="text-align:center"><div style="font-weight:800;margin-bottom:6px">'+label+'</div><div style="font-size:12px;opacity:.8">Desactiva AdBlock para ver anuncios</div></div>';
    el.innerHTML=''; el.appendChild(box);
  }
  function initAds(){
    var E=W.__ENV||{};
    var L=document.getElementById('ad-left');
    var R=document.getElementById('ad-right');
    var B=document.getElementById('ad-bottom');

    var any=false;

    // JUICYADS laterales (usa tu JUICYADS_ZONE real)
    if (E.JUICYADS_ZONE){
      injectScript(L, 'https://js.juicyads.com/jp.php?zone='+encodeURIComponent(E.JUICYADS_ZONE));
      injectScript(R, 'https://js.juicyads.com/jp.php?zone='+encodeURIComponent(E.JUICYADS_ZONE));
      any=true;
    }

    // EXOCLICK o EROADVERTISING para el bloque inferior si están configurados
    if (E.EXOCLICK_ZONE){
      // formato común de ExoClick zone
      var d=document.createElement('div'); d.id='exoclick-'+E.EXOCLICK_ZONE; B.innerHTML=''; B.appendChild(d);
      injectScript(B, 'https://a.exdynsrv.com/nativeads.js');
      any=true;
    } else if (E.EROADVERTISING_ZONE){
      // algunos publishers usan esta ruta con ?zone=ID; si tu snippet oficial es distinto, pégalo como HTML en EROADVERTISING_SNIPPET_B64
      injectScript(B, 'https://syndication.ero-advertising.com/script.php?zone='+encodeURIComponent(E.EROADVERTISING_ZONE));
      any=true;
    }

    if(!any){
      fallback(L,'Publicidad'); fallback(R,'Publicidad');
      if(B){ B.innerHTML='<div class="ad-bottom">Espacio publicitario</div>'; }
    }
  }
  W.IBG_ADS={initAds};
})(window);
