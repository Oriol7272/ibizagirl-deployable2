(function(W){
  function b64(s){try{return atob(s)}catch(_){return ""}}
  function injectHTML(html){var d=document.createElement('div'); d.innerHTML=html; document.body.appendChild(d);}
  function initAds(){
    var E=W.__ENV||{};
    if(E.EXOCLICK_ZONE){
      var ex=document.createElement('script'); ex.src="https://a.magsrv.com/ad-provider.js"; ex.async=true; ex.dataset.zone=E.EXOCLICK_ZONE; document.body.appendChild(ex);
    }
    if(E.JUICYADS_SNIPPET_B64){ injectHTML(b64(E.JUICYADS_SNIPPET_B64)); }
    else if(E.JUICYADS_ZONE){
      var s=document.createElement('script'); s.src="https://js.juicyads.com/jp.php?zone="+encodeURIComponent(E.JUICYADS_ZONE); s.async=true; document.body.appendChild(s);
    }
    if(E.EROADVERTISING_SNIPPET_B64){ injectHTML(b64(E.EROADVERTISING_SNIPPET_B64)); }
    else if(E.EROADVERTISING_ZONE){
      var er=document.createElement('script'); er.src="https://ero-advertising.com/script?zone="+encodeURIComponent(E.EROADVERTISING_ZONE); er.async=true; document.body.appendChild(er);
    }
    if((E.POPADS_ENABLE||"").toString().toLowerCase()==="true" && E.POPADS_SITE_ID){
      var p=document.createElement('script'); p.src="https://cdn.popads.net/pop.js"; p.async=true; document.body.appendChild(p);
      W.popads_config={siteId:E.POPADS_SITE_ID};
    }
  }
  W.IBG_ADS={initAds};
})(window);
